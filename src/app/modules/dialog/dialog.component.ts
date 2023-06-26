import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { DialogAction, DialogAnswer, DialogType } from "./dialog.model";
import { DialogService } from "./dialog.service";
import { filter, tap } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { dialogAnimation, dialogWrapperAnimation } from "./dialog.animation";
import { ImageService } from "../../services/image.service";
import { SafeUrl } from "@angular/platform-browser";
import { LLMap } from "@modules/map.lib";
import { icon, LatLng, marker } from "leaflet";
import { Router } from "@angular/router";

@UntilDestroy()
@Component({
    selector: "app-dialog",
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [dialogWrapperAnimation, dialogAnimation],
})
export class DialogComponent implements OnInit {
    map: LLMap;
    template: TemplateRef<any>;
    _showed$ = new Subject<boolean>();
    tabIdx: number;
    _mode: DialogType = "popup";
    constructor(
        private cdr: ChangeDetectorRef,
        private dialogService: DialogService,
        private imageService: ImageService,
        private router: Router
    ) {}
    @Input() id_dialog = "main_app_dialog";

    tplData = {
        error_tpl: "Целевой шаблон не задан",
        error_tpl_code: "ERR_TPL_BLANK",
    };
    tpl_context = {
        $implicit: this.tplData,
    };
    tpl_custom = false;

    @ViewChild("tpl_popup_placement", { static: true })
    tpl_placement: TemplateRef<any>;

    @ViewChild("tpl_popup_person", { static: true })
    tpl_person: TemplateRef<any>;

    @ViewChild("tpl_popup_other", { static: true }) 
    tpl_other: TemplateRef<any>;

    @ViewChild("tpl_popup_contragent", { static: true })
    tpl_contragent: TemplateRef<any>;

    @ViewChild("tpl_dialog_feedback_form", { static: true })
    tpl_feedback_form: TemplateRef<any>;

    @ViewChild("tpl_suggestion", { static: true })
    tpl_registration_suggestion: TemplateRef<any>;

    @ViewChild("tpl_popup_blank", { static: true })
    tpl_default: TemplateRef<any>;

    @ViewChild("tpl_prompt", { static: true })
    tpl_prompt: TemplateRef<any>;

    mapsExistTplKeys = ["contragent"];

    photoUrl$: Observable<SafeUrl>;
    imageSignal$: BehaviorSubject<null>;
    dialogAnswer$: Subject<DialogAnswer>;

    mapTimeout: number = 200;

    hasMapTpl(key: string): boolean {
        return this.mapsExistTplKeys.includes(key) ?? null;
    }

    ngOnInit(): void {
        this.template = this.tpl_default;

        if (this.id_dialog) {
            this.dialogService.dialogBus$
                .pipe(
                    filter((action) => action.dialogKey === this.id_dialog),
                    filter(
                        (action) =>
                            action.action === "close" ||
                            (!!action.mode &&
                                (!!action.template || !!action.templateKey))
                    ),
                    tap(() => (this.tabIdx = 0)),
                    untilDestroyed(this)
                )
                .subscribe((action) => {
                    if (action.action === "show") {
                        this.dialogAnswer$ =
                            action.dialogAnswerPipe$ ??
                            new Subject<DialogAnswer>();
                        
                        const _tpl = this.getTemplate(action);
                        if (!_tpl) return;
                    
                        this.tpl_context.$implicit = action.data;

                        if (this.imageSignal$) {
                            this.imageSignal$.complete();
                            this.imageSignal$ = null;
                            this.photoUrl$ = null;
                        }

                        const imgData = this.imageService.getImage$(action?.data?.photo);
                        this.photoUrl$ = imgData?.[0];
                        this.imageSignal$ = imgData?.[1];
                       
                        if (this.hasMapTpl(action.templateKey)) {
                            this.showMapMarker(action);
                        }

                        this.showDialog(action, _tpl);

                    }
                    if (action.action === "close") {
                        this.uninstallDialog();
                    }
                });
        }
    }

    showDialog(action: Partial<DialogAction>, tpl: TemplateRef<any>): void {
        switch (action.mode) {
            case "dialog":
                this.openDialog(tpl);
                break;
            case "popup":
                this.openPopup(tpl);
                break;
        }
    }

    getTemplate(action: Partial<DialogAction>) {
        this.tpl_custom = !!action.template;
        return action.template || this[`tpl_${action.templateKey}`];
    }

    showMapMarker(action: Partial<DialogAction>): void {
        if (!action?.data?.position_lat || !action?.data?.position_lon) return;
        setTimeout(() => {
            const el = document.getElementById("dialog_viewport");
            const mapEl =
                el?.querySelector(".map_container");
            if (!mapEl) {
                return;
            }
            this.map = new LLMap();
            this.map.buildSimple(mapEl as HTMLElement);
            const position = new LatLng(
                action.data.position_lat,
                action.data.position_lon
            );
            marker(position, {
                icon: icon({
                    iconUrl: "img/icons/hospital.png",
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                }),
            }).addTo(this.map.map);
            this.map.fitByLatLonAnimate(
                {
                    lat: action.data.position_lat,
                    lon: action.data.position_lon,
                },
                this.mapTimeout
            );               
        }, this.mapTimeout);
        
    }

    openDialog(tpl: TemplateRef<any>): void {
        this.installDialog(tpl, "dialog");
    }

    openPopup(tpl: TemplateRef<any>): void {
        this.installDialog(tpl, "popup");
    }

    closeDialog(): void {
        this._showed$.next(false);
    }

    uninstallDialog(): void {
        this.dialogAnswer$.complete();
        this.dialogAnswer$ = null;
        this.template = null;
        this.tpl_context.$implicit = this.tplData;
        this._mode = "popup";
        if (this.map) {
            this.map.destroy();
        }
        this.closeDialog();
    }

    installDialog(tpl: TemplateRef<any>, mode: DialogType): void {
        const dialogUpdated = this.generateDialog(tpl);
        const modeUpdated = this.setDialogMode(mode);
        this._showed$.next(true);
        if (!!dialogUpdated || !!modeUpdated) {
            this.cdr.markForCheck();
        }
    }

    generateDialog(template: TemplateRef<any>): boolean {
        if (this.template !== template) {
            this.template = template;
            return true;
        }
        return false;
    }

    setDialogMode(mode: DialogType): boolean {
        if (this._mode !== mode) {
            this._mode = mode;
            return true;
        }
        return false;
    }

    setTabIdx(idx: number): void {
        this.tabIdx = idx;
        this.cdr.markForCheck();
    }

    sendFeedback(data: Record<string, any>): void {
        console.log("sendFeedback", data);
        const votes = data?.votes ?? {};
        const answer: DialogAnswer = {
            action: "submit",
            templateKey: "tpl_feedback_form",
            data: {
                votes: Object.keys(votes).map((k) => ({
                    slug: k,
                    rate: Number(votes[k]),
                })),
                comment: data.comment,
            },
        };
        this.dialogAnswer$.next(answer);
        this.uninstallDialog();
    }

    gotoRegistration(): void {
        this.dialogService.closeOpenedDialog("main_app_dialog");
        this.router.navigate(["/auth"]).then();
    }

    submitDialog(): void {
        this.dialogAnswer$.next();
        this.uninstallDialog();
    }

    cancelDialog(): void {
        this.dialogAnswer$.error('cancel dialog');
    }
}
