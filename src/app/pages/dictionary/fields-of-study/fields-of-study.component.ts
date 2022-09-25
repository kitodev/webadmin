import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { FieldsOfStudy, FieldsOfWork } from 'src/app/core/models/loopback.model';
import { LoopbackService } from 'src/app/core/services/loopback.service';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fields-of-study',
  templateUrl: './fields-of-study.component.html',
  styleUrls: ['./fields-of-study.component.scss']
})
export class FieldsOfStudyComponent implements OnInit, OnDestroy {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  isNew = false;
  fieldsOfStudyId: number;

  listFieldsOfStudyToEdit: FieldsOfStudy;

  public fieldsOfStudyForm: FormGroup;
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
          this.fieldsOfStudyId = params.id;
        }
      })
  }

  ngOnInit(): void {
    this.loadListFieldsOfStudyCategory();

    if(!this.isNew) {
      this.loopbackService
        .findFieldsOfStudyById(this.fieldsOfStudyId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listFieldsOfStudyToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const fieldsOfStudyFormModel: FormModel<FieldsOfStudy> = {
      id: [this.listFieldsOfStudyToEdit ? this.listFieldsOfStudyToEdit.id : 0, Validators.required],
      fieldsOfStudyCategoryId: [this.listFieldsOfStudyToEdit ? this.listFieldsOfStudyToEdit.fieldsOfStudyCategoryId : 0, Validators.required],
      name: [this.listFieldsOfStudyToEdit ? this.listFieldsOfStudyToEdit.name : '', Validators.required],
      isActive: [this.listFieldsOfStudyToEdit ? this.listFieldsOfStudyToEdit.isActive : 0, Validators.required],
  }

    this.fieldsOfStudyForm = this.fb.group(fieldsOfStudyFormModel);
    
    this.loopbackService
    .listFieldsOfStudyCategories()
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

  loadListFieldsOfStudyCategory(): any {
    this.loopbackService
    .listFieldsOfStudies(this.fieldsOfStudyId)
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
        this.fieldsOfStudyForm.reset();
        this.buildForm();
        this.router.navigate(['/fields-of-study/list'])
            .then();
      }
    })
  }

  saveSettings(): void {
    if (this.fieldsOfStudyForm.value) {
      this.fieldsOfStudyForm.controls['isActive'].value == true 
      ? this.fieldsOfStudyForm.controls['isActive'].setValue(1) 
      : this.fieldsOfStudyForm.controls['isActive'].setValue(0);

      const fieldsOfStudy: FieldsOfStudy = {
        ...this.fieldsOfStudyForm.value,
      };  

      this.loopbackService
      .saveFieldsOfStudy(fieldsOfStudy)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.fieldsOfStudyForm.markAllAsTouched();
        this.router.navigate(['/dictionary/fields-of-study/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.fieldsOfStudyForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
