import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CTG} from '@services/lk.service';
import {RestService} from '@services/rest.service';
import {config, Observable} from 'rxjs';
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

    @ViewChild('ctg_ent_clinic') public tpl_ent_clinic: TemplateRef<any>;
    @ViewChild('default', {static: true}) public tpl_default: TemplateRef<any>;
    tpl: TemplateRef<any>;

    contragent$: Observable<Contragent>;
    bgColor: string;

    ngOnInit(): void {
        if (!!this.contragent) {
            this.contragent$ = this.restService.getEntity(this.contragent.entKey, this.contragent.entId);
            this.bgColor = this.contragent.color ?? '#ffffff';
            this.tpl = this['tpl_' + this.contragent?.entKey] ?? this.tpl_default;
        } else {
            this.tpl = this.tpl_default;
        }
    }

}
