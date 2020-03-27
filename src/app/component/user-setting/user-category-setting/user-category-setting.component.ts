import {Component, OnInit, ViewChild} from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatSnackBar, MatTreeNestedDataSource} from '@angular/material';
import {BehaviorSubject, range} from 'rxjs';
import {CategoryService} from '../../../service/category.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../dialog/confirm-dialog/confirm-dialog.component';

interface CategoryNode {
  id: string;
  name: string;
  parent?: boolean;
  children?: CategoryNode[];
  editing?: boolean;
}

@Component({
  selector: 'app-user-category-setting',
  templateUrl: './user-category-setting.component.html',
  styleUrls: ['./user-category-setting.component.scss']
})
export class UserCategorySettingComponent implements OnInit {
  treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();
  dataChange = new BehaviorSubject<CategoryNode[]>([]);
  constructor(
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.dataChange.next(this.dataSource.data);
  }

  ngOnInit() {
    this.categoryService.getUserCategory().subscribe(data => {
      this.dataSource.data = data;
    }, error => {
      console.log(error);
    });
  }
  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;

  addNewItem(node: CategoryNode) {
    this.insertItem(node, '');
    const data = this.dataSource.data;
    this.reloadData(data);
    this.treeControl.expand(node);
  }

  insertItem(parent: CategoryNode, name: string) {
    if (parent.children) {
      if (!parent.children.find(it => it.editing)) {
        parent.children.push({id: null, name, parent: false, editing: true} as unknown as CategoryNode);
      }
    } else {
      parent.children = [{
        id: null,
        name,
        parent: false,
        editing: true
      }];
    }
  }

  editItem(node: CategoryNode) {
    node.editing = true;
  }

  saveItem(node: CategoryNode) {
    const parent = this.getParentId(node);

    if (parent) {
      if (node.id) {
        this.categoryService.editUserCategory(node.id, node).subscribe(data => {
          this.snackBar.open('Категория успешно изменена', 'Категории');
          node.editing = false;
        }, error => {
          console.log(error);
        });
      } else {
        this.categoryService.createUserCategory(parent.id, node).subscribe(data => {
          this.snackBar.open('Категория успешно добавлена', 'Категории');
          node.id = data.id;
          node.editing = false;
        }, error => {
          console.log(error);
        });
      }
    }
  }

  deleteItem(node: CategoryNode) {
    const parent = this.getParentId(node);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      height: '200px',
      data: {
        message: 'Вы уверены?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.deleteUserCategory(node.id, node).subscribe(data => {
          this.reloadData(data);
          this.snackBar.open(`Категория ${node.name} удалена`, 'Категории');
          this.treeControl.dataNodes = data;
          this.treeControl.expand(data.find(it => it.id === parent.id));
        }, error => {
          console.log(error);
        });
      }
    });

  }

  reloadData(data: any) {
    this.dataSource.data = null;
    this.dataSource.data = data;
    this.dataChange.next(this.dataSource.data);
  }

  getParentId(node: CategoryNode): CategoryNode {
    let parent = null;
    this.dataSource.data.forEach(category => {
      if (category.children) {
        if (category.children.find(child => child === node)) {
          parent = category;
        }
      }
    });
    return parent;
  }
}
