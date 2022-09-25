import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { FieldsOfWork } from 'src/app/core/models/loopback.model';
import { LoopbackService } from 'src/app/core/services/loopback.service';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fields-of-work',
  templateUrl: './fields-of-work.component.html',
  styleUrls: ['./fields-of-work.component.scss']
})
export class FieldsOfWorkComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  isNew = false;
  fieldsOfWorkId: number;

  listFieldsOfWorkToEdit: FieldsOfWork;

  public fieldsOfWorkForm: FormGroup;
  public categories: any[] = [];

  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public loadingSubject$: Observable<boolean> =
    this.loadingSubject.asObservable();

  constructor(private cdr: ChangeDetectorRef,
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
          this.fieldsOfWorkId = params.id;
        }
      })
  }

  ngOnInit(): void {
    this.loadListFieldsOfWorkCategory();

    if(!this.isNew) {
      this.loopbackService
        .findFieldsOfWorkById(this.fieldsOfWorkId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listFieldsOfWorkToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const fieldsOfWorkFormModel: FormModel<FieldsOfWork> = {
      id: [this.listFieldsOfWorkToEdit ? this.listFieldsOfWorkToEdit.id : 0, Validators.required],
      fieldsOfWorkCategoryId: [this.listFieldsOfWorkToEdit ? this.listFieldsOfWorkToEdit. fieldsOfWorkCategoryId : 0, Validators.required],
      name: [this.listFieldsOfWorkToEdit ? this.listFieldsOfWorkToEdit.name : '', Validators.required],
      isActive: [this.listFieldsOfWorkToEdit ? this.listFieldsOfWorkToEdit.isActive : 0, Validators.required],
      highlighted: [this.listFieldsOfWorkToEdit ? this.listFieldsOfWorkToEdit.highlighted : 0, Validators.required],

  }

    this.fieldsOfWorkForm = this.fb.group(fieldsOfWorkFormModel);

    this.loopbackService
    .listFieldsOfWorkCategories()
    .subscribe((res: any) => {
      res.forEach((element: any) => {
        this.categories.push(element);
        if(res && element) {
          this.loadingSubject.next(false);
        }
      });
    });
  }

  loadListFieldsOfWorkCategory(): any {
    this.loopbackService
    .listFieldsOfWorks(this.fieldsOfWorkId)
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
        this.fieldsOfWorkForm.reset();
        this.buildForm();
        this.router.navigate(['/dictionary/fields-of-works/list'])
            .then();
      }
    })
  }

  saveSettings(): void {
    if (this.fieldsOfWorkForm.value) {
      this.fieldsOfWorkForm.controls['highlighted'].value == true 
      ? this.fieldsOfWorkForm.controls['highlighted'].setValue(1) 
      : this.fieldsOfWorkForm.controls['highlighted'].setValue(0);

      this.fieldsOfWorkForm.controls['isActive'].value == true 
      ? this.fieldsOfWorkForm.controls['isActive'].setValue(1) 
      : this.fieldsOfWorkForm.controls['isActive'].setValue(0);

      const fieldsOfWork: FieldsOfWork = {
        ...this.fieldsOfWorkForm.value,
      };  

      this.loopbackService
      .saveFieldsOfWork(fieldsOfWork)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.fieldsOfWorkForm.markAllAsTouched();
        this.router.navigate(['/dictionary/fields-of-works/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.fieldsOfWorkForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
