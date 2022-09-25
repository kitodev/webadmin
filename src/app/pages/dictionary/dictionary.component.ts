import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Tag, TagCategory } from 'src/app/core/models/loopback.model';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../core/services/loopback.service';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  tagId: number;
  tagCategoryId: number;
  listCategoryId: number;
  listTagToEdit: Tag;
  listTag: Tag[] = [];
  editMode = false;
  isNew = false;
  listTagCategoryToEdit: TagCategory;
  public dictionaryForm: FormGroup;

  public categories: any[] = [];
  public types: any[] = [];

  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public loadingSubject$: Observable<boolean> =
    this.loadingSubject.asObservable();

  constructor(
    private cdr: ChangeDetectorRef,
    private loopbackService: LoopbackService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: HotToastService,
    private router: Router
  ) {
    this.loadingSubject.next(true);

    this.route.params
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((params) => {
      if(params.id == 'new') {
        this.isNew = true;
      } else {
        this.tagId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadListTagCategory();

    if(!this.isNew) {
      this.loopbackService
        .findTagById(this.tagId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listTagToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const dictionaryFormModel: FormModel<Tag> = {
      id: [this.listTagToEdit ? this.listTagToEdit.id : 0, Validators.required],
      tagCategoryId: [this.listTagToEdit ? this.listTagToEdit.tagCategoryId : 0, Validators.required],
      name: [this.listTagToEdit ? this.listTagToEdit.name : '', Validators.required],
      isActive: [this.listTagToEdit ? this.listTagToEdit.isActive : 0, Validators.required],
      type: [this.listTagToEdit ? this.listTagToEdit.type : 0, Validators.required],
      showFrontend: [this.listTagToEdit ? this.listTagToEdit.showFrontend : 0, Validators.required],
    }

    this.dictionaryForm = this.fb.group(dictionaryFormModel);

    const firstType = {
      id: 10,
      value: 'MD',
      name: 'Minddiák'
    };

    const secondType = {
      id: 20,
      value: 'HC',
      name: 'Humáncentrum'
    }


    this.types.push(firstType);
    this.types.push(secondType);

    this.loopbackService
    .listTagCategories()
    .subscribe((res: any) => {
      res.forEach((element: any) => {
        this.categories.push(element);
        console.log(this.categories);
        if(res && element) {
          this.loadingSubject.next(false);
        }
      });
    });
  }

  loadListTagCategory(): any {
    this.loopbackService
    .listTags(this.listCategoryId)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((response) => {
      this.cdr.detectChanges();
    });
  }

  reset(): void {
    Swal.fire({
      title: 'Biztos elveted a műveletet?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Igen',
      cancelButtonText: 'Nem'
    }).then((result) => {
      if (result.value) {
        this.dictionaryForm.reset();
        this.router.navigate(['/dictionary/list'])
            .then();
        this.buildForm();
      }
    })
  }

  saveSettings(): void {
    if (this.dictionaryForm.value) {
      this.dictionaryForm.controls['showFrontend'].value == true 
      ? this.dictionaryForm.controls['showFrontend'].setValue(1) 
      : this.dictionaryForm.controls['showFrontend'].setValue(0);

      this.dictionaryForm.controls['isActive'].value == true 
      ? this.dictionaryForm.controls['isActive'].setValue(1) 
      : this.dictionaryForm.controls['isActive'].setValue(0);

      const dictionary: Tag = {
        ...this.dictionaryForm.value,
      };

      dictionary.type = (dictionary.type
      ? parseInt(dictionary.type.toString(), 10) : 0);

      this.loopbackService
      .saveTag(dictionary)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.dictionaryForm.markAsDirty();
        this.dictionaryForm.markAllAsTouched();
        this.router.navigate(['/dictionary/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.dictionaryForm.markAsDirty();
      this.dictionaryForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
