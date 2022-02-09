import {Component, OnInit} from '@angular/core';
import {LkService} from '@services/lk.service';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

    constructor(
        private lkService: LkService,
    ) {
    }

    selectedCTG$ = this.lkService.selectedContragents$;

    ngOnInit(): void {}

    // Validation
    // getSectionConfig(key: SectionType): Observable<ConfiguratorConfigSrc> {
    //     return this.restService.getConfiguratorSettings(key);
    // }
    //
    // generateValidationTreeFromConfig(config: ConfiguratorConfigSrc, orders: Order[]): ValidationTreeSimple {
    //     const contragentTabs = config.tabs;
    //     const contragentFloors = (contragentTabs.reduce(
    //         (floors, tab) => ([...floors, ...tab.floors]), [] as TabFloorSetting[]) ?? []) as TabFloorSetting[];
    //
    //     return {
    //         tabs: contragentTabs.map(tab => {
    //             return {
    //                 key: tab.key,
    //                 required: tab?.required ?? false,
    //                 selected: 0,
    //                 selectionMode: tab?.selectMode ?? 'multi',
    //                 status: 'pending',
    //                 locked: false,
    //                 message: '',
    //             } as ValidationTreeItem;
    //         }) ?? [],
    //         floors: contragentFloors.map(floor => {
    //             return {
    //                 key: floor.key,
    //                 required: floor?.required ?? false,
    //                 selected: 0,
    //                 selectionMode: floor?.selectMode ?? 'multi',
    //                 status: 'pending',
    //                 locked: false,
    //                 message: '',
    //             } as ValidationTreeItem;
    //         }) ?? [],
    //         orders: orders,
    //         isInvalid: false,
    //         config,
    //     };
    // }
    //
    // calculateTreeSelections(tree: ValidationTreeSimple): ValidationTreeSimple {
    //     tree.orders.forEach(order => {
    //         tree.tabs.forEach(tab => tab.selected = order.tab_key === tab.key
    //             ? tab.selected + 1
    //             : tab.selected);
    //         tree.floors.forEach(floor => floor.selected = order.floor_key === floor.key
    //             ? floor.selected + 1
    //             : floor.selected);
    //     });
    //     return tree;
    // }
    //
    // calculateTreeStatuses(tree: ValidationTreeSimple): ValidationTreeSimple {
    //     const contragentTabs = tree.config.tabs;
    //     tree.tabs.forEach(tab => {
    //         const tabConfig = contragentTabs?.find(t => tab.key === t.key);
    //         tab.status = 'valid';
    //         if (tab.selected === 0) {
    //             tab.status = tab.required ? 'poor' : 'valid';
    //         }
    //         if (tab.selected >= 1) {
    //             tab.locked = tab.selectionMode === 'single';
    //         }
    //         if (tab.selected > 1) {
    //             tab.status = tab.selectionMode === 'single' ? 'rich' : 'valid';
    //         }
    //         if (tab.status !== 'valid') {
    //             tab.message = tab.status === 'poor'
    //                 ? tabConfig?.poorErrorMessage || tabConfig?.defaultMessage || 'Выберите хотя бы один пункт'
    //                 : tabConfig?.richErrorMessage || tabConfig?.defaultMessage || 'Может быть выбран только один пункт';
    //             tree.isInvalid = true;
    //         }
    //         if (tab.locked && tab.status === 'valid') {
    //             tab.message = tabConfig.lockMessage || '';
    //         }
    //     });
    //     tree.floors.forEach(floor => {
    //         const floorConfigs = contragentTabs?.reduce(
    //             (floors, tab) => ([...floors, ...tab.floors]), [] as TabFloorSetting[]);
    //         const targetConfig = floorConfigs.find(f => f.key === floor.key);
    //         floor.status = 'valid';
    //         if (floor.selected === 0) {
    //             floor.status = floor.required ? 'poor' : 'valid';
    //         }
    //         if (floor.selected >= 1) {
    //             floor.locked = floor.selectionMode === 'single';
    //         }
    //         if (floor.selected > 1) {
    //             floor.status = floor.selectionMode === 'single' ? 'rich' : 'valid';
    //         }
    //         if (floor.status !== 'valid') {
    //             floor.message = floor.status === 'poor'
    //                 ? targetConfig?.poorErrorMessage || targetConfig?.defaultMessage || 'Выберите хотя бы один пункт'
    //                 : targetConfig?.richErrorMessage || targetConfig?.defaultMessage || 'Может быть выбран только один пункт';
    //             tree.isInvalid = true;
    //         }
    //         if (floor.locked && floor.status === 'valid') {
    //             floor.message = targetConfig.lockMessage || '';
    //         }
    //     });
    //
    //     return tree;
    // }

}
