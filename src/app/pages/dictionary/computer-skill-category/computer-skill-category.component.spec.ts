import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputerSkillCategoryComponent } from './computer-skill-category.component';

describe('ComputerSkillCategoryComponent', () => {
  let component: ComputerSkillCategoryComponent;
  let fixture: ComponentFixture<ComputerSkillCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComputerSkillCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputerSkillCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
