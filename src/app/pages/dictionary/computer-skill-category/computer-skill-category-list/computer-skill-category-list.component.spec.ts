import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerSkillCategoryListComponent } from './computer-skill-category-list.component';

describe('ComputerSkillCategoryListComponent', () => {
  let component: ComputerSkillCategoryListComponent;
  let fixture: ComponentFixture<ComputerSkillCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComputerSkillCategoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputerSkillCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
