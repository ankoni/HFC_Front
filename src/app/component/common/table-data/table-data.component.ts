import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSnackBar, MatTableDataSource} from '@angular/material';
import {FilterData} from '../filter-form/filter-form.component';
import {MatDialog} from '@angular/material/dialog';
import {CreateFinanceRecord, FinanceTableData} from '../../content/finance-table/finance-table.component';
import {FieldForm} from '../field-form';

export class ColumnsData {
  columnDefinition: string;
  columnName: string;
  elementData: any[];
}

export class ActionMenu {
  name: string;
  action: () => void;
}

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss']
})
export class TableDataComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild('matFinanceTable', {static: false}) table;
  @ViewChild('recordDrawer', {static: true}) editRecordDataDrawer;

  actionMenuList: ActionMenu[];
  tableTitle: string;
  filter: FilterData[] = [];

  columnsToDisplay = [];
  columnsData: ColumnsData[] = [];
  recordData: FinanceTableData[] = [];
  dataSource: MatTableDataSource<FinanceTableData>;
  pageSize: any[] = [10, 20, 30];

  openRow: any;
  formFields: FieldForm[];

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getDataTable();
  }

  getDataTable(): void {
  }

  filterTable(filters: FilterData[]): void {
    this.filter = filters;
    this.getDataTable();
  }

  openDrawer(row: any) {
    if (this.openRow === row && this.editRecordDataDrawer.opened) {
      this.editRecordDataDrawer.close();
    } else {
      this.openRow = row;
      this.editRecordDataDrawer.open();
    }
  }

}
