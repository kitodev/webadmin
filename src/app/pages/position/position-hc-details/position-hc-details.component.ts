import { PositionComputerSkill, PositionQualification, PositionTag, PositionDrivingLicence, PositionMd } from './../../../core/models/loopback.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil, Observable, BehaviorSubject } from 'rxjs';
import { PositionHcs, PositionLanguage, Positions, Referers, Users } from 'src/app/core/models/loopback.model';
import { LoopbackService } from '../../../core/services/loopback.service';
import { NgForm } from '@angular/forms';
import { LayoutService } from 'src/app/_metronic/layout';
import Swal from 'sweetalert2';

type Tabs = 'Pozíció' | 'Export' | 'Jelentkezők' | 'Interjúk' | 'Jogosultságok' | 
'Üzenetek' |
'Napló'|
'Fájlok' |
'Projekt';

@Component({
  selector: 'app-position-hc-details',
  templateUrl: './position-hc-details.component.html',
  styleUrls: ['./position-hc-details.component.scss']
})
export class PositionHcDetailsComponent implements OnInit {
  errors: HttpErrorResponse;
  activeTab: Tabs = 'Pozíció';
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  configLoading: boolean = false;
  resetLoading: boolean = false;
  listPositionDetail: Positions[] = [];
  listPositionHcs: PositionHcs[] = [];
  listPositionMd: PositionMd[] = [];
  listPositionHc: any[] = [];
  isNew = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  listPosition: any[] = [];
  private unsubscribe = new Subject<void>();
  positionId: number;
  listLanguage: PositionLanguage[] = [];
  languages: any[] = [];
  positionComputerSkills: PositionComputerSkill[] = [];
  computerSkills: any[] = [];
  positionQualification: PositionQualification[] = [];
  positionQualifications: any[] = [];
  positionTag: PositionTag[] = [];
  positionTags: any[] = [];
  listDrivingLicences: PositionDrivingLicence[] = [];
  listDrivingLicence: any[] = [];
  listReferer: Referers[] = [];
  listUsers: Users[] = [];
  display: boolean = false;

  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public loadingSubject$: Observable<boolean> =
    this.loadingSubject.asObservable();

  constructor(
    private layout: LayoutService,  
    private cdr: ChangeDetectorRef,
    private loopbackService: LoopbackService,
    private router: Router,
    private toastService: HotToastService,
    private route: ActivatedRoute) { 
      this.loadingSubject.next(true);

    this.route.params
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        if(params.id == 'new') {
          console.log(params.id);
          this.isNew = true;
        } else {
          this.positionId = params.id;
        }
      })
  }

  ngOnInit() {
    if(this.positionId) {
      this.loadExistingPositions();
    }
    
    this.model = this.layout.getConfig();
  }

  setActiveTab(tab: Tabs) {
    this.activeTab = tab;
  }
  
  resetPreview(): void {
    this.resetLoading = true;
    this.layout.refreshConfigToDefault();
  }

  submitPreview(): void {
    this.configLoading = true;
    this.layout.setConfig(this.model);
    location.reload();
  }

  private loadExistingPositions(): void {
    this.loopbackService
    .findPositionsById(this.positionId)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((response) => {
      this.listPositionDetail = response;
      this.listPosition.push(response);
      this.loadingSubject.next(false);
    });

    this.loopbackService
      .findPositionHcsById(this.positionId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.listPositionHcs = response;
        this.listPositionHc.push(response);
        this.loadingSubject.next(false);
      });

    this.loopbackService
      .listUser()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.listUsers = response;
        this.loadingSubject.next(false);
    });

    this.loopbackService
      .listReferers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.listReferer = response;
        this.loadingSubject.next(false);
      });

    this.loopbackService
      .findPositionsLanguagesById(this.positionId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.listLanguage = response;
        this.loadingSubject.next(false);
      });

    this.loopbackService
      .findPositionsComputerSkillsById(this.positionId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.positionComputerSkills = response;
        this.loadingSubject.next(false);
      });
    
    this.loopbackService
      .findPositionsQualificationById(this.positionId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.positionQualification = response;
        this.loadingSubject.next(false);
      });

    this.loopbackService
      .findPositionsTagById(this.positionId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.positionTag = response
        this.loadingSubject.next(false);
      });

      this.loopbackService
      .findDrivingLicenceById(this.positionId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.listDrivingLicences = response;
        this.listDrivingLicence.push(response);
        this.loadingSubject.next(false);
      });
  }

  addAdmin(): any {
    Swal.fire({
      title: 'Adminisztrátor hozzárendelése',
      html: '<label required>User Employee User Id</label><select class="swal2-input"><option>Kerlek valassz...</option><option value="1" name="1">Value 1</option></select><br />' +
      '<label class="form-check form-check-sm form-check-custom form-check-solid me-5"><input class="form-check-input" type="checkbox" value="1" /><span class="form-check-label">E-mail értesítést kér</span></label> '
    })
  }
  
  showDialog() {
    this.display = true;
  }

  uploadFile() {
    
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
