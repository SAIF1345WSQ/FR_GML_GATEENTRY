import { Component, inject, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WithDocService } from '../services/with-doc.service';

interface MaterialOutward {
  srNo: number;
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
  selector: 'app-material-outward',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './material-outward.component.html',
  styleUrl: './material-outward.component.css'
})

export class MaterialOutwardComponent {

  materialOutward: MaterialOutward = this.getEmptyForm();
  @Input() list: any[] = [];          // ismein hi filtered items rahengi (HTML isi ko use karta hai)
  @Input() _label: string = 'cardCode';     // display + search field 1
  @Input() _label2: string = 'cardName' // default label for display
  @Input() _img: string = 'image';
  @Input() size: string = '';
  @Input() value: string = ''
  @Output() valueChange = new EventEmitter<string>();
  @Output() itemSelected = new EventEmitter<any>();
  transactionTypeOptions = ['With PO', 'Without PO'];
  FilteredItemRows: any[] = [];
  Item: any[] = [];     
  Supplier: any[] = [];       
  poSuggestions: any[] = [];
 fullList: any[] = [];  
  withoutPoItems: any[] = [];  
  newItem: any = this.getEmptyItem();
  ViewArray :any=[];
  shown = false;
  Update= false;
  keyword = '';
  filteredItems: any[] = [];
  isItemSelected = false;

  itemSearch = '';
  showItemDropdown = false;
  
  docTypeOptions = [
    { key: 'SALES', value: 'SALES' },
    { key: 'RGPOUT', value: 'RGP' },
    { key: 'NRGPOUT', value: 'NRGP' },
    { key: 'CASHOUT', value: 'CASH' },
    { key: 'CHALLAN OUT', value: 'CHALLAN' },
    { key: 'IUTOUT', value: 'IUT' },
    { key: 'COURIEROUT', value: 'COURIER' },
    { key: 'OTHERS', value: 'Others' }
  ];
  WithdocTypeOptions = [
    { key: 'SALES', value: 'SALES' },
    { key: 'RGPOUT', value: 'RGP' },
    { key: 'NRGPOUT', value: 'NRGP' },
    { key: 'IUTOUT', value: 'IUT' },
    { key: 'OTHERS', value: 'Others' }
  ];
  WithoutdocTypeOptions = [
    { key: 'CASHOUT', value: 'CASH' },
    { key: 'CHALLAN OUT', value: 'CHALLAN' },
    { key: 'COURIEROUT', value: 'COURIER' },
    { key: 'OTHERS', value: 'Others' }
  ];
  Uom: any[] = [
    { uomCode: 'PCS', uomName: 'PCS' },
    { uomCode: 'KG', uomName: 'KG' },
    { uomCode: 'GM', uomName: 'GM' },
    { uomCode: 'LTR', uomName: 'LTR' },
    { uomCode: 'MTR', uomName: 'MTR' },
    { uomCode: 'BOX', uomName: 'BOX' },
    { uomCode: 'SET', uomName: 'SET' },
    { uomCode: 'NOS', uomName: 'NOS' }
  ];

  warehouse: any[] = [
    { whsCode: 'WH01', whsName: 'Main Warehouse' },
    { whsCode: 'WH02', whsName: 'Raw Material Store' },
    { whsCode: 'WH03', whsName: 'Finished Goods Store' },
    { whsCode: 'WH04', whsName: 'Scrap Store' },
    { whsCode: 'WH05', whsName: 'Quality Check Store' }
  ];


  private WithDocSer = inject(WithDocService);
resetForm(): void {
    this.materialOutward = this.getEmptyForm();
  }
  getEmptyForm(): MaterialOutward {
    return {
      srNo: 0,
      transactionType: 'With PO',
      docType: 'RGPOUT',
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
  ngOnInit() {
    this.GetSupplier();
  }
  BackToAddMode(){
  window.location.reload();
}
  GetSupplier() {
    this.WithDocSer.GetSupplier(this.materialOutward.docType).subscribe(
      (data: any) => {
      this.Supplier = data.data;
       this.list = data.data;
        this.fullList = data.data;
        this.Item = data.items;
        this.warehouse = data.warehouse;
        this.Uom = data.uom;
        this.filteredItems = this.Item.slice(0, 50);
        this.materialOutward.GateEntrySeries = data.gateEntrySeries
        this.onTransactionTypeChange();
      },
      (error: any) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }
  onTransactionTypeChange(): void {
    if (this.materialOutward.transactionType === 'Without PO') {
      this.docTypeOptions = [...this.WithoutdocTypeOptions];
      this.materialOutward.poNo = '';
    }
    else if (this.materialOutward.transactionType === 'With PO') {
      this.docTypeOptions = [...this.WithdocTypeOptions];
    }
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
    this.materialOutward.supplierCode = item[this._label];
    this.materialOutward.SupplierName = item[this._label2];
    this.WithDocSer.GetDocNum(this.materialOutward.supplierCode, this.materialOutward.docType).subscribe(
      (data: any) => {
        this.poSuggestions = data;
      }
    );
  }
selectPo(po: any) {
    this.WithDocSer.GetItemsByDocNum(po, this.materialOutward.docType).subscribe(
      (data: any) => {
        this.FilteredItemRows = data;
        this.FilteredItemRows.forEach(item => {
          item.PODate = this.convertDate(item.PODate);
          item.ReceivingQty = 0;
          item.Selected = true;
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
  SaveGateOUT() {
    // Implement the logic to save the material outward data
    this.materialOutward.GatePassType = "OUT";
    if(this.materialOutward.transactionType == "Without PO"){
     this.materialOutward.SelectedAllItems = this.withoutPoItems; 
    }
    else{
        this.materialOutward.SelectedAllItems = this.FilteredItemRows;
    }
    
   if(this.Update == true){
 this.WithDocSer.UpdateGateIn(this.materialOutward).subscribe(
      (data: any) => {
        alert('Gate In saved successfully.');
       window.location.reload();
        this.FilteredItemRows = [];
      },
      (error: any) => {
        console.error('Error saving Gate In:', error);
        alert('Error saving Gate In. Please try again.');
      }
    );
   }
   else{
 this.WithDocSer.SaveGateIn(this.materialOutward).subscribe(
      (data: any) => {
        alert('Gate In saved successfully.');
       window.location.reload();
        this.FilteredItemRows = [];
      },
      (error: any) => {
        console.error('Error saving Gate In:', error);
        alert('Error saving Gate In. Please try again.');
      }
    );
   }

   
  }
  saveMaterialInward() {
    // Implement the logic to save the material inward data
    console.log('Material Inward Data:', this.materialOutward);
  }
  SelectItem(ITEM: any) {

  }
  getEmptyItem() {
    return {
      ItemCode: '',
      ItemName: '',
      UOM: '',
      Warehouse: '',
      Quantity: null,
      Remarks: ''
    };
  }

  resetNewItem() {
    this.newItem = this.getEmptyItem();
    this.isItemSelected = false;
    this.filteredItems = this.Item.slice(0, 50);
  }

  // ---------- Item search dropdown ----------
 openItemDropdown(): void {
  this.showItemDropdown = true;
  this.filteredItems = this.filterList(this.itemSearch);
}

closeItemDropdown(): void {
  // small delay not needed because we use (mousedown) on options,
  // which fires before blur
  this.showItemDropdown = false;
}

toggleItemDropdown(event: MouseEvent): void {
  event.preventDefault(); // keeps input focus / avoids premature blur
  this.showItemDropdown = !this.showItemDropdown;
  if (this.showItemDropdown) {
    this.filteredItems = this.filterList(this.itemSearch);
  }
}

filterItems(value: string): void {
  this.itemSearch = value;
  this.showItemDropdown = true;
  this.filteredItems = this.filterList(value);

  // if user clears the box, clear the selected item too
  if (!value) {
    this.newItem.ItemCode = '';
    this.newItem.ItemName = '';
  }
}

private filterList(value: string): any[] {
  const term = (value || '').toLowerCase().trim();
  if (!term) return [...this.Item];
  return this.Item.filter(i =>
    (i.itemCode || '').toString().toLowerCase().includes(term) ||
    (i.itemName || '').toString().toLowerCase().includes(term)
  );
}

selectItem(it: any): void {
  this.newItem.ItemCode = it.itemCode;
  this.newItem.ItemName = it.itemName;
  this.itemSearch = `${it.itemCode} - ${it.itemName}`;
  this.showItemDropdown = false;
}

  // ---------- Validation ----------
  private isValid(item: any, isNewRow: boolean = false): boolean {
    // if (isNewRow && !this.isItemSelected) {
    //   alert('Please select an item from the list.');
    //   return false;
    // }
    // if (!item.ItemCode?.toString().trim() ||
    //     !item.ItemName?.toString().trim() ||
    //     !item.UOM ||
    //     !item.Warehouse ||
    //     !item.Quantity || item.Quantity <= 0) {
    //   alert('Item Code, Item Name, UOM, Warehouse and a valid Qty are required.');
    //   return false;
    // }
    return true;
  }

  // ---------- Add / Edit / Update / Cancel / Delete ----------
  addItem() {
    if (!this.isValid(this.newItem, true)) return;
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

  // ---------- Save ----------
  // Strips UI-only fields before sending to the API.
  getWithoutPoPayload() {
    return this.withoutPoItems.map(({ isEditing, backup, ...rest }) => rest);
  }
   ViewGateIN(): void {
    this.WithDocSer.ViewGateIn("Out").subscribe({
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
        this.materialOutward = data.resultList_H[0];
        this.FilteredItemRows = data.resultList_R;
        this.FilteredItemRows.forEach((item: any) => {
          item.Selected = true;
        });
        (document.getElementById('partyName') as HTMLInputElement).value =
          this.materialOutward.partyName || '';
      },
      error: (err) => {
        console.error('Gate In load failed', err);
      }
    });
  }
  searchTextModal = '';

get filteredArray(): any[] {
  const list = this.ViewArray || [];
  const t = (this.searchTextModal || '').toLowerCase().trim();
  if (!t) return list;

  return list.filter((it:any) =>
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
