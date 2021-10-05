import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormService, IFieldSetting, ILinkFieldSetting} from '../../form.service';
import {DictService, IDictItem} from '../../dict.service';
import {IImageOptions, ITableItem} from '../../table/table/table.component';
import {EMENUMODE, IMenuRepo} from '../Dashboard.component';
import {IEntityItem} from '../../entity.model';
import {FormGroup} from '@angular/forms';
import {ContainerService} from '../../container.service';
import {IFileAdditionalData, IRestBody} from '../../rest.service';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {distinct, filter} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {EntityService} from '../../entity.service';

@Component({
    selector: 'app-editor',
    templateUrl: './Editor.component.html',
    styleUrls: ['./Editor.component.css']
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

    constructor(
        private dict: DictService,
        private forms: FormService,
        private ent: EntityService,
        private cont: ContainerService,
        private toastr: ToastrService,
    ) {
    }

    containerLinker$: BehaviorSubject<ITableItem[]> = new BehaviorSubject<any[]>([]);

    public get isEditMode(): boolean {
        return this.mode === EMENUMODE.EDIT;
    }

    public get isCreateMode(): boolean {
        return this.mode === EMENUMODE.CREATE;
    }

    public get isDeleteMode(): boolean {
        return this.mode === EMENUMODE.DELETE;
    }

    public get isViewMode(): boolean {
        return this.mode === EMENUMODE.VIEW;
    }

    @Input() mode: EMENUMODE;
    @Input() menu: IMenuRepo;

    public stable = false;

    public currentService: IEntityItem;
    public refresh: Function;

    public form: FormGroup = new FormGroup({});
    public fields: IFieldSetting[] = [];
    public linkFields: ILinkFieldSetting[] = [];
    public currentError: string;

    private conditionsSubscribers: { [name: string]: ILinkFieldSetting[] } = {};
    private conditionsSubscribersSetter$ = new Subject<string>();
    private conditionsSubscribersSubscription: Subscription;

    private fileForUpload: File;
    public mainImgOpt: IImageOptions = {
        urlType: 'simple',
        urlKey: 'filename',
    };

    registerConditionStream() {
        // складываем эмиттеров событий(без повторений)
        if (!!this.conditionsSubscribersSubscription) {
            this.conditionsSubscribersSubscription.unsubscribe();
        }
        this.conditionsSubscribersSubscription = this.conditionsSubscribersSetter$.pipe(
            distinct()
        ).subscribe(fieldName => this.conditionsSubscribers[fieldName] = []);

        // формируем новый сет подписчиков на поля
        this.registerConditionSubs();
    }

    registerConditionSubs() {
        // формируем подписчиков
        this.linkFields.forEach(lf => {
            if (lf.conditionField) {
                this.conditionsSubscribersSetter$.next(lf.conditionField);
            }
        });

        Object.keys(this.conditionsSubscribers).forEach(key => {
            this.conditionsSubscribers[key] = this.linkFields.filter(field => field.conditionField === key);
        });

    }

    checkConditionFields(fieldKey?: string) {
        if (!!fieldKey && !!this.conditionsSubscribers[fieldKey]) {

            const curField = this.fields.find(f => f.id === fieldKey);
            const curentValueRAW = curField.control.value;
            const value = curField.type === 'select' && curField.useDict ?
                curField.dctItems.find(di => di.id.toString() === curentValueRAW.toString()) :
                curentValueRAW;
            this.conditionsSubscribers[fieldKey].forEach(subField => {
                subField.hide = subField.conditionKey ?
                    subField.conditionValue !== value[subField.conditionKey] :
                    subField.conditionValue !== value;

                if (subField.proxyTo) {
                    this.form.get(subField.proxyTo).setValue(null);
                }
            });

        } else {

            Object.keys(this.conditionsSubscribers).forEach(fk => {
                const curField = this.fields.find(f => f.id === fk);
                const curentValueRAW = curField.control.value;
                const value = curField.type === 'select' && curField.useDict && curField.dctItems ?
                    curField.dctItems.find(di => di.id.toString() === curentValueRAW.toString()) :
                    curentValueRAW;

                this.conditionsSubscribers[fk].forEach(subField => {
                    subField.hide = subField.conditionKey ?
                        subField.conditionValue !== value[subField.conditionKey] :
                        subField.conditionValue !== value;
                });
            });

        }
    }

    private rerenderFields() {
        console.log('render: ', this.fields);
        if (!(this.fields && this.fields.length)) {
            return;
        }
        this.fields.forEach(field => {

            // добавить валидаторы если потом введем в систему
            field.control = this.forms.createFormControl(null, field.required);

            // регистрация теневого контрола для загрузки файла
            if (field.type === 'img') {
                field.mirrorControl = this.forms.createFormControl(null);
                field.titleControl = this.forms.createFormControl(null);
                field.descriptionControl = this.forms.createFormControl(null);
            }

            if (field.readonly && this.mode === EMENUMODE.VIEW) {
                field.control.disable();
            }
            // готовим словари
            if (!!field.useDict && !!field.dctKey) {
                field.initData ?
                    field.control.setValue(field.initData) :
                    field.control.setValue(null);
                field.loaded = false;
                this.dict.getDict(field.dctKey)
                    .pipe(filter(data => !!data))
                    .subscribe((dict: IDictItem[]) => {
                        field.dctItems = dict;
                        if (field.required && !field.canBeNull && !field.initData && dict[0]) {
                            field.control.setValue(dict[0]['id']);
                        }
                        this.checkConditionFields();
                    });
            }
        });

        this.linkFields.forEach(field => {
            if (field.imageLoader) {
                field.imageControl = this.forms.createFormControl(null);
                field.titleControl = this.forms.createFormControl(null);
                field.descriptionControl = this.forms.createFormControl(null);
            }
        });

        this.forms.registerFields(this.fields, this.form);
        console.log('dev form:', this.form);
    }

    public setImageForUpload(ev) {
        if (ev.target['files'][0]) {
            this.fileForUpload = ev.target['files'][0];
        }
    }

    public uploadImage(field: IFieldSetting) {
        console.log('file to upload', field);
        if (this.fileForUpload) {
            const _data: IFileAdditionalData = {
                title: field.titleControl.value,
                description: field.descriptionControl.value
            };

            this.ent.uploadImg(this.fileForUpload, _data).subscribe(data => {
                if (data.file && data.file.id) {
                    const file_id = data.file.id;
                    field.control.setValue(file_id);
                    field.mirrorControl.setValue('');
                    this.fileForUpload = null;
                }
            });
        }

    }

    public uploadImageWithLoader(field: ILinkFieldSetting): void {
        console.log('file to upload with loader', field);
        if (this.fileForUpload) {
            const _data: IFileAdditionalData = {
                title: field.titleControl.value,
                description: field.descriptionControl.value
            };

            this.ent.uploadImg(this.fileForUpload, _data).subscribe(data => {
                if (data.file && data.file.id) {
                    this.toastr.success('Файл загружен', 'id: ' + data.file.id);
                    field.imageControl.setValue('');
                    this.fileForUpload = null;
                    if (field.refresher) {
                        field.refresher();
                    }
                    if (field.proxyTo) {
                        this.form.get(field.proxyTo).setValue(data.file.id);
                    }
                    this.refresh();
                }
            });
        }

    }

    private rerenderValueOfFields() {
        console.log('rerender: ', this.fields);
        this.fields.forEach(field => {
            field.initData && field.control ?
                field.control.setValue(field.initData) :
                field.control.setValue(null);
            if (field.required && !field.canBeNull && !field.initData && !!field.dctItems && !!field.dctItems.length) {
                field.control.setValue(field.dctItems[0]['id']);
            }
        });
    }

    ngOnInit() {
        this.forms.registerInRepo('editor', this.form);
    }

    ngAfterViewInit() {
        setTimeout(() => this.stable = true, 1000);
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        // Add '${implements OnChanges}' to the class.
        if (!changes.mode) {
            // this.currentService = null;
            setTimeout(() => this.close(), 10);
            return;
        }
        if (changes.mode.currentValue === EMENUMODE.CREATE) {
            this.currentService = null;
            this.form.reset();
            this.rerenderValueOfFields();
        }
        if (!!changes.menu && !!changes.menu.currentValue) {
            console.log('test menu changed', changes.menu);
            this.ent.getEntSet(this.menu.name).subscribe(set => {
                this.fields = set.fields && set.fields.map(f => {
                    if (f.type === 'id' && !!f.useDict) {
                        f.type = 'select';
                    }
                    f.id = f['key'];
                    return f;
                });

                this.linkFields = set.links;

                this.registerConditionStream();
                this.rerenderFields();
            }, (err) => this.currentError = err.message ? err.message : err);
        }
    }

    public selectControl(item: IFieldSetting, ev) {

        item.dictSelected = ev.target.value;

        this.checkConditionFields(item.id);

        console.log('selected:', item, ev);
    }

    public refreshAssign(e) {
        this.refresh = e;
    }

    public refreshAsignByField(field: ILinkFieldSetting | IFieldSetting, e) {
        field.refresher = e;
    }

    public selectServiceFromTable(service: ITableItem) {
        if (!service) {
            this.currentService = null;
            this.form.reset();
            this.rerenderValueOfFields();
            return;
        }
        console.log('selected service: ', service);

        this.currentService = service.data;

        // заполняем поля формы
        if (service.data) {
            Object.keys(service.data).forEach(key => {
                if (key in service.data) {
                    // определяем наличие формы
                    const target = this.fields.find(f => f.id === key);
                    console.log('target control: ', target);
                    if (!!target && target.control) {
                        target.control.setValue(service.data[key]);
                        if (
                            service.data[key] === null &&
                            target.required &&
                            !target.canBeNull &&
                            !target.initData &&
                            !!target.dctItems &&
                            !!target.dctItems.length
                        ) {
                            target.control.setValue(target.dctItems[0]['id']);
                        }
                    }
                }
            });
        }

        // Получение данных для контейнеров
        if (this.menu.type === 'container' && this.isEditMode) {
            // получаем контейнер по типу и id
            this.cont.getContainer(this.menu.containerKey, service.data.id).subscribe(containerData => {
                console.log('GET container DATA:', containerData);
                if (!containerData.items) {
                    return;
                }
                const dummyItems = containerData.items.map(itemsEnt => <ITableItem>({
                    data: itemsEnt.entity,
                    text: '' + itemsEnt.entity.id,
                    selected: true,
                }));

                this.containerLinker$.next(dummyItems);
            }, (err) => this.currentError = err.message ? err.message : err);
        }

        if (this.isCreateMode) {
            if (this.form.get('id')) {
                this.form.get('id').setValue(null);
            }
        }

        this.checkConditionFields();
    }

    public linkFromTableSelected(selected: ITableItem, field: ILinkFieldSetting) {
        let value = null;
        if (!!selected && !!selected.data && selected.data.id) {
            value = selected.data.id;
        }
        const key = field.proxyTo || field.entKey;
        if (this.form.get(key)) {
            this.form.get(key).setValue(value);
        }
        console.log('new form state: ', this.form.value);
    }

    public removeEntity() {
        // if(this.currentService && /*confirm("Уверен что хочешь удалить услугу?")*/){
        if (this.currentService && confirm('Уверен что хочешь удалить ' + this.menu.titleVoc)) {

            switch (this.menu.type) {
                case 'container':
                    this.cont.removeContainer(this.menu.containerKey, this.currentService.id).subscribe(() => {
                        this.refresh();
                        this.currentService = null;
                        this.toastr.success('Удаление сущности ', 'Сущность ' + this.menu.titleVoc + ' успешно удалена');
                    }, (err) => this.currentError = err.message ? err.message : err);
                    break;
                default:
                    this.ent.remEnt(this.menu.name, this.currentService.id).subscribe(() => {
                        this.refresh();
                        this.currentService = null;
                        this.toastr.success('Удаление сущности ', 'Сущность ' + this.menu.titleVoc + ' успешно удалена');
                    }, (err) => this.currentError = err.message ? err.message : err);
            }
        }
    }

    public createEntity(): void {
        // собрать все поля формы в объект сущности
        const data: IEntityItem = this.form.getRawValue();
        for (const d in data) {
            if (data[d] === null) {
                delete data[d];
            }
        }
        // отправить post с сущностью
        if (confirm('Уверен что хочешь создать ' + this.menu.titleVoc + ' ?')) {
            this.ent.createEnt(this.menu.name, data).subscribe(() => {
                // alert('Сущность успешно создана');
                this.toastr.success('Создание сущности', 'Сущность ' + this.menu.titleVoc + ' успешно создана');
                this.form.reset();
                this.currentService = null;
                this.forms.closeForm();
            }, (err) => this.currentError = err.message ? err.message : err);
        }
    }

    public editEntity() {

        const data: IEntityItem = this.form.getRawValue();
        for (const d in data) {
            if (data[d] === null) {
                delete data[d];
            }
        }

        // if(this.currentService && confirm("Уверен что хочешь изменить услугу?")){

        if (this.currentService) {
            data.id = this.currentService.id;
            this.ent.createEnt(this.menu.name, data).subscribe(() => {

                // alert('Сущность успешно изменена');
                this.refresh();
                this.form.reset();
                this.currentService = null;

                this.toastr.success('Редактирование сущности', 'Сущность ' + this.menu.titleVoc + ' успешно изменена');

            }, (err) => this.currentError = err.message ? err.message : err);
        }
    }

    public dictReseter(): void {
        if (!!this.menu && !!this.menu.isDict) {
            this.dict.resetDict();
        }
    }

    public close() {
        this.forms.closeForm();
    }

    public saveItemsOfContainer() {
        const ids4save = this.containerLinker$.value.map(di => di.data.id);
        const body: IRestBody = {body: {ids: ids4save}};
        this.cont.saveContainer(this.menu.containerKey, this.currentService.id, body)
            .subscribe(() => {
                // alert('Данные сохранены');
                this.refresh();
                // this.close();
                this.currentService = null;
            }, (err) => this.currentError = err.message ? err.message : err);
    }

    public closeCurrentError() {
        this.currentError = null;
    }

    ngOnDestroy() {
        if (!!this.conditionsSubscribersSubscription) {
            this.conditionsSubscribersSubscription.unsubscribe();
        }
    }
}

