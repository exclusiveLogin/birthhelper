import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CTG} from '@services/lk.service';
import {RestService} from '@services/rest.service';
import {Observable} from 'rxjs';
import {Contragent} from '@models/contragent.interface';

@Component({
    selector: 'app-contragent-header',
    templateUrl: './contragent-header.component.html',
    styleUrls: ['./contragent-header.component.scss']
})
export class ContragentHeaderComponent implements OnInit {

    @Input() public contragent: CTG;
    constructor(
        private restService: RestService,
    ) {
    }

    @ViewChild('ctg_ent_clinics', {static: true}) public tpl_ent_clinics: TemplateRef<any>;
    @ViewChild('ctg_ent_contragents', {static: true}) public tpl_ent_contragents: TemplateRef<any>;
    @ViewChild('default', {static: true}) public tpl_default: TemplateRef<any>;
    tpl: TemplateRef<any>;

    contragent$: Observable<Contragent>;
    bgColor: string;

    ngOnInit(): void {
        if (!!this.contragent) {
            this.contragent$ = this.restService.getEntity('ent_contragents', this.contragent.entId);
            this.bgColor = this.contragent.color ?? '#ffffff';
            this.tpl = this.tpl_ent_contragents ?? this.tpl_default;
        } else {
            this.tpl = this.tpl_default;
        }
    }

}
