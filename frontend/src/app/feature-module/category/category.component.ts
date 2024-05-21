import { Component } from '@angular/core';
import { CategoryQueryResult, CategoryRoot } from 'src/app/core/models/category';
import { CommonService } from 'src/app/core/services/common.service';
import { OrderService } from 'src/app/core/services/order.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {

  baseUrl = 'http://localhost:4000/uploads/'
  categories: CategoryRoot[] = []

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.getCategories().subscribe((result: CategoryRoot[]) => {
      this.categories = result;
    });
  }
}
