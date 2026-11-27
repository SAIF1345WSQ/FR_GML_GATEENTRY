import {
  Component, OnInit, EventEmitter, Input, Output,
  HostListener, ElementRef, OnChanges, SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { WithDocService } from '../services/with-doc.service';
import { inject } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { subscribeOn } from 'rxjs';

interface MaterialInward {
  srNo: number;
  DocEntry?:number;
  transactionType: string;
  docType: string;
  date: string;
  partyName: string;
  senderAddress: string;
  challanInvoiceNo: string;
  challanInvoiceDate: string;
  deliveryPersonName: string;
  vehicleNo: string;
  materialDetails: string;
  quantity: string;
  qualityCondition: string;
  securityPersonName: string;
  receiverName: string;
  invoiceAmount: string;
  remarks: string;
  poNo: string;
  GateEntrySeries: string;
  GatePassType: string;
  supplierCode?: string;
  SupplierName?: string;
  SelectedAllItems?: any[];
}

@Component({
  selector: 'app-material-inward',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, MatPaginatorModule],
  templateUrl: './material-inward.component.html',
  styleUrls: ['./material-inward.component.css']
})
export class MaterialInwardComponent {

  @Input() list: any[] = [];          // ismein hi filtered items rahengi (HTML isi ko use karta hai)
  @Input() _label: string = 'cardCode';     // display + search field 1
  @Input() _label2: string = 'cardName' // default label for display
  @Input() _img: string = 'image';
  @Input() size: string = '';
  @Input() value: string = ''
  @Output() valueChange = new EventEmitter<string>();
  @Output() itemSelected = new EventEmitter<any>();
  shown = false;
  keyword = '';
  fullList: any[] = [];
  private readonly storageKey = 'materialInwardRecords';
  materialInward: MaterialInward = this.getEmptyForm();
  Supplier: any[] = [];
  materialInwardList: MaterialInward[] = [];
  filteredDocList: any[] = [];
  FilteredItemRows: any[] = [];
  poSuggestions: any[] = [];
  selectedItems: any[] = [];
  withoutPoItems: any[] = [];
  Item: any[] = [];
  ViewArray: any[] = [];
  filteredItems: any[] = [];
  Uom: any[] = [];
  warehouse: any[] = [];
  filters: any[] = [];
  itemDropdownOpen = false;
  Update = false;
  itemKeyword = '';
  itemDropdownPos = { top: 0, left: 0 };
  newItem: any = this.getEmptyItem();
  pageIndex = 0;
  pageSize = 10;
  itemsPerPage: number = 10;
  RejectCount: number = 0;
  searchText = '';
  showList = false;
  transactionTypeOptions = ['With PO', 'Without PO'];

  docTypeOptions = [
    'PURCHASE',
    'PANTRYITEM',
    'RGP',
    'NRGP',
    'CASH',
    'CHALLAN',
    'IUT',
    'COURIER',
    'OTHERS'
  ];
  private withoutPoDocTypes = ['PURCHASE', 'RGP', 'NRGP', 'IUT'];
  private withPoDocTypes = ['PANTRYITEM', 'CHALLAN', 'COURIER', 'OTHERS'];
  constructor(private elRef: ElementRef) {
    this.loadRecords();
  }
  private WithDocSer = inject(WithDocService);

  ngOnInit() {
    //this.loadSuppliers();
    this.onDocTypeChange();
  }
BackToAddMode(){
  window.location.reload();
}
  onDocTypeChange() {
    this.WithDocSer.GetSupplier(this.materialInward.docType).subscribe(
      (data: any) => {
        this.Supplier = data.data;
        this.list = data.data;
        this.fullList = data.data;
        this.Item = data.items;
        this.warehouse = data.warehouse;
        this.Uom = data.uom;
        this.filteredItems = this.Item.slice(0, 50);
        this.materialInward.GateEntrySeries = data.gateEntrySeries
        this.onTransactionTypeChange();
      },
      (error: any) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list']) {
      this.fullList = this.list || [];
    }
  }
  show(): void {
    this.shown = !this.shown;
    if (this.shown) {
      this.keyword = '';
      this.list = this.fullList;
    }
  }
  search(event: any): void {
    const keyword = event.target.value;
    if (!keyword) {
      this.list = this.fullList;
      return;
    }
    const searchTerm = keyword.toLowerCase().trim();
    this.list = this.fullList.filter(item => {
      const val1 = String(item[this._label] ?? '').toLowerCase();
      const val2 = String(item[this._label2] ?? '').toLowerCase();
      return val1.includes(searchTerm) || val2.includes(searchTerm);
    });
  }
  select(item: any): void {
    this.value = item[this._label] + ' - ' + item[this._label2];;
    this.valueChange.emit(this.value);
    this.itemSelected.emit(item);
    this.shown = false;
    this.keyword = '';
    this.list = this.fullList;
    this.materialInward.supplierCode = item[this._label];
    this.materialInward.SupplierName = item[this._label2];
    this.WithDocSer.GetDocNum(this.materialInward.supplierCode, this.materialInward.docType).subscribe(
      (data: any) => {
        this.poSuggestions = data;
      }
    );
  }



  getEmptyForm(): MaterialInward {
    return {
      srNo: 0,
      transactionType: 'With PO',
      docType: 'PURCHASE',
      date: new Date().toISOString().substring(0, 10),
      partyName: '',
      senderAddress: '',
      challanInvoiceNo: '',
      challanInvoiceDate: '',
      deliveryPersonName: '',
      vehicleNo: '',
      materialDetails: '',
      quantity: '',
      qualityCondition: '',
      securityPersonName: '',
      receiverName: '',
      invoiceAmount: '',
      remarks: '',
      poNo: '',
      GateEntrySeries: '',
      supplierCode: '',
      GatePassType: '',
    };
  }
  loadRecords(): void {
    try {
      this.materialInwardList = JSON.parse(
        localStorage.getItem(this.storageKey) || '[]'
      );
    } catch {
      this.materialInwardList = [];
    }
  }
  saveToStorage(): boolean {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.materialInwardList)
      );
      return true;
    } catch {
      alert('Unable to save records in browser storage.');
      return false;
    }
  }
  get filteredRecords(): MaterialInward[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.materialInwardList;
    }

    return this.materialInwardList.filter(item =>
      String(item.srNo).includes(search) ||
      item.transactionType.toLowerCase().includes(search) ||
      item.docType.toLowerCase().includes(search) ||
      item.partyName.toLowerCase().includes(search) ||
      item.challanInvoiceNo.toLowerCase().includes(search) ||
      item.vehicleNo.toLowerCase().includes(search) ||
      item.materialDetails.toLowerCase().includes(search) ||
      item.poNo.toLowerCase().includes(search)
    );
  }
  onTransactionTypeChange(): void {
    if (this.materialInward.transactionType === 'Without PO') {
      this.materialInward.poNo = '';
      this.docTypeOptions = [...this.withPoDocTypes];
    }
    else if (this.materialInward.transactionType === 'With PO') {
      this.docTypeOptions = [...this.withoutPoDocTypes];
    }
    else {
      this.docTypeOptions = [];
    }
  }
  saveMaterialInward(): void {
    if (
      !this.materialInward.date ||
      !this.materialInward.docType ||
      !this.materialInward.partyName.trim() ||
      !this.materialInward.securityPersonName.trim()
    ) {
      alert('Please fill Date, Doc Type, Party Name and Security Person Name.');
      return;
    }

    if (
      this.materialInward.transactionType === 'With PO' &&
      !this.materialInward.poNo.trim()
    ) {
      alert('Please enter PO Number for With PO transaction.');
      return;
    }
    const nextSrNo = this.materialInwardList.length > 0
      ? Math.max(...this.materialInwardList.map(item => item.srNo || 0)) + 1
      : 1;

    const newRecord: MaterialInward = {
      ...this.materialInward,
      srNo: nextSrNo
    };

    this.materialInwardList.unshift(newRecord);

    if (!this.saveToStorage()) {
      this.materialInwardList.shift();
      return;
    }

    alert('Material inward record saved successfully.');

    this.resetForm();
  }

  resetForm(): void {
    this.materialInward = this.getEmptyForm();
  }
  deleteRecord(item: MaterialInward): void {
    const confirmDelete = confirm(
      `Are you sure you want to delete record ${item.srNo}?`
    );

    if (!confirmDelete) {
      return;
    }

    const oldList = [...this.materialInwardList];

    this.materialInwardList = this.materialInwardList.filter(
      record => record !== item
    );

    if (!this.saveToStorage()) {
      this.materialInwardList = oldList;
    }
  }
  selectPo(po: any) {
    this.WithDocSer.GetItemsByDocNum(po, this.materialInward.docType).subscribe(
      (data: any) => {
        this.FilteredItemRows = data;
        this.FilteredItemRows.forEach(item => {
          item.PODate = this.convertDate(item.PODate);
          item.ReceivingQty = 0;
        });
      }
    );
  }
  convertDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  SelectItem(item: any): void {
    if (item) {
      if (this.selectedItems.length) {
        for (let i = 0; i < this.selectedItems.length; i++) {
          if (this.selectedItems[i].BaseDocEntry === item.BaseDocEntry && this.selectedItems[i].LineNumber === item.LineNumber) {
            this.selectedItems.splice(i, 1);
            return;
          }
        }
      }
      this.selectedItems.push({
        PONumber: item.PONumber,
        BaseDocEntry: item.BaseDocEntry,
        LineNumber: item.LineNumber,
        PODate: item.PODate,
        ItemCode: item.ItemCode,
        ItemName: item.ItemName,
        ItmfrgName: item.ItmfrgName,
        Wharehouse: item.Wharehouse,
        Quantity: item.Quantity,
        POBlanceQty: item.POBlanceQty,
        UomCode: item.UomCode,
        ReceivingQty: item.ReceivingQty,
        Selected: true,
        LineID: item.LineNumber
      });
    }
  }
  SaveGateIN() {
    this.materialInward.GatePassType = "IN";
    if (this.materialInward.transactionType == "Without PO") {
      this.withoutPoItems.forEach(element => {
        element.Selected = true;
      });
      this.materialInward.SelectedAllItems = this.withoutPoItems;
    }
    else {
      this.materialInward.SelectedAllItems = this.FilteredItemRows;
    }
    if (this.Update == true) {
 this.WithDocSer.UpdateGateIn(this.materialInward).subscribe(
        (data: any) => {
          alert('Gate In saved successfully.');
          this.resetForm();
          window.location.reload();
          this.selectedItems = [];
          this.FilteredItemRows = [];
        },
        (error: any) => {
          console.error('Error saving Gate In:', error);
          const msg =
            error?.error?.message ||
            (typeof error?.error === 'string' ? error.error : null) ||
            error?.message ||
            'Unknown error';

          alert('Error saving Gate In: ' + msg);
        }
      );
    }
    else {
      this.WithDocSer.SaveGateIn(this.materialInward).subscribe(
        (data: any) => {
          alert('Gate In saved successfully.');
          this.resetForm();
          window.location.reload();
          this.selectedItems = [];
          this.FilteredItemRows = [];
        },
        (error: any) => {
          console.error('Error saving Gate In:', error);
          const msg =
            error?.error?.message ||
            (typeof error?.error === 'string' ? error.error : null) ||
            error?.message ||
            'Unknown error';

          alert('Error saving Gate In: ' + msg);
        }
      );
    }
  }
  getEmptyItem() {
    return { ItemCode: '', ItemName: '', UOM: '', Warehouse: '', Quantity: null, Remarks: '' };
  }
  private isValid(item: any): boolean {
    if (!item.ItemCode?.trim() || !item.ItemName?.trim() || !item.UOM?.trim()
      || !item.Warehouse?.trim() || !item.Quantity || item.Quantity <= 0) {
      alert('Item Code, Item Name, UOM, Warehouse and a valid Qty are required.');
      return false;
    }
    return true;
  }
  addItem() {
    if (!this.isValid(this.newItem)) return;
    this.withoutPoItems.push({ ...this.newItem, isEditing: false });
    this.resetNewItem();
  }
  editItem(item: any) {
    const { backup, ...copy } = item;   // snapshot for Cancel
    item.backup = copy;
    item.isEditing = true;
  }
  updateItem(item: any) {
    if (!this.isValid(item)) return;
    item.isEditing = false;
    delete item.backup;
  }

  cancelEdit(item: any) {
    Object.assign(item, item.backup);
    item.isEditing = false;
    delete item.backup;
  }
  deleteItem(index: number) {
    if (confirm('Delete this item?')) {
      this.withoutPoItems.splice(index, 1);
    }
  }
  showItem(event: MouseEvent): void {
    this.itemDropdownOpen = !this.itemDropdownOpen;
    if (this.itemDropdownOpen) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      this.itemDropdownPos = { top: rect.bottom, left: rect.left };
      this.itemKeyword = '';
      this.filteredItems = this.Item.slice(0, 50);
    }
  }
  searchItem(event: any): void {
    const term = (event.target.value || '').toLowerCase().trim();
    this.filteredItems = this.Item
      .filter(i =>
        !term ||
        String(i.itemCode ?? '').toLowerCase().includes(term) ||
        String(i.itemName ?? '').toLowerCase().includes(term))
      .slice(0, 50);
  }
  selectItem(it: any): void {
    this.newItem.ItemCode = it.itemCode;
    this.newItem.ItemName = it.itemName;
    this.itemDropdownOpen = false;
    this.itemKeyword = '';
    this.filteredItems = this.Item.slice(0, 50);
  }



  // dropdown ke bahar click karne par band
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.shown = false;                  // party dropdown
    }
    if (!(event.target as HTMLElement).closest('.item-dropdown')) {
      this.itemDropdownOpen = false;       // item dropdown
    }
  }
  ViewGateIN(): void {
    this.WithDocSer.ViewGateIn("In").subscribe({
      next: (data: any) => {
        this.ViewArray = data;
      },
      error: (err) => {
        console.error('Gate In load failed', err);
        this.ViewArray = [];
      }
    });
  }
  EditEntry(docEntry: any) {

    this.WithDocSer.GetRecord(docEntry).subscribe({
      next: (data: any) => {
        this.Update = true;
        this.poSuggestions = (data.poSuggestion || []).map((x: any) =>
          Object.keys(x).reduce((obj: any, key: string) => {
            obj[key.charAt(0).toUpperCase() + key.slice(1)] = x[key];
            return obj;
          }, {})
        );
        this.materialInward = data.resultList_H[0];
        this.FilteredItemRows = data.resultList_R;
        this.FilteredItemRows.forEach((item: any) => {
          item.Selected = true;

          //item.POBlanceQty= parseInt( item.Quantity) - parseInt(item.ReceivingQty);
        });
        (document.getElementById('partyName') as HTMLInputElement).value =
          this.materialInward.partyName || '';


      },
      error: (err) => {
        console.error('Gate In load failed', err);
      }
    });
  }
  resetNewItem() {
    this.newItem = this.getEmptyItem();
    this.itemKeyword = '';
    this.filteredItems = this.Item.slice(0, 50);
  }


  //VIEW 
  filterItems(items: any[]) {
    return items.filter(item =>
      Object.keys(this.filters).every((key: any) => {
        const filterValue = this.filters[key];
        if (!filterValue) return true;
        return item[key]
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toString().toLowerCase());
      })
    );
  }
  enableEdit(data: any) {

  }
  onPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  pagedFilterItems(company: any) {
    const list = this.filterItems(company);
    const start = this.pageIndex * this.itemsPerPage;
    return list.slice(start, start + this.itemsPerPage);
  }
searchTextModal = '';

get filteredArray(): any[] {
  const list = this.ViewArray || [];
  const t = (this.searchTextModal || '').toLowerCase().trim();
  if (!t) return list;

  return list.filter(it =>
    (
      (it.gateEntrySeries ?? '') + ' ' +
      (it.docType ?? '') + ' ' +
      (it.docNum ?? '') + ' ' +
      (it.billDate ?? '') + ' ' +
      this.toDisplayDate(it.billDate) + ' ' +
      (it.challanNo ?? '') + ' ' +
      (it.cardCode ?? '') + ' ' +
      (it.cardName ?? '')
    ).toLowerCase().includes(t)
  );
}

private toDisplayDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = String(iso).substring(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

}
