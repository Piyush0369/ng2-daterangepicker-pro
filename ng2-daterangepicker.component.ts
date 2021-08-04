import {
  Directive,
  AfterViewInit,
  OnDestroy,
  DoCheck,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  KeyValueDiffers
} from '@angular/core';
import 'bootstrap-daterangepicker-plus';
import $ from "jquery";
import { DaterangepickerConfig } from "./ng2-daterangepicker.service";

@Directive({
  selector: '[daterangepicker]'
})
export class DaterangepickerComponent implements AfterViewInit, OnDestroy, DoCheck {

  private activeRange: any;
  private targetOptions: any = {};
  private _differ: any = {};

  public datePicker: any;

  @Input() options: any = {};
  @Input() color: any = "";

  @Output() selected = new EventEmitter();
  @Output() cancelDaterangepicker = new EventEmitter();
  @Output() applyDaterangepicker = new EventEmitter();
  @Output() hideCalendarDaterangepicker = new EventEmitter();
  @Output() showCalendarDaterangepicker = new EventEmitter();
  @Output() hideDaterangepicker = new EventEmitter();
  @Output() showDaterangepicker = new EventEmitter();

  constructor(
    private input: ElementRef,
    private config: DaterangepickerConfig,
    private differs: KeyValueDiffers
  ) {
    this._differ['options'] = this.differs.find(this.options).create();
    this._differ['settings'] = this.differs.find(this.config.settings).create();
  }

  ngAfterViewInit() {
    this.render();
    this.attachEvents();
  }

  ngDoCheck() {
    let optionsChanged = this._differ['options'].diff(this.options);
    let settingsChanged = this._differ['settings'].diff(this.config.settings);

    if (optionsChanged || settingsChanged) {
      this.render();
      this.attachEvents();
      if (this.activeRange && this.datePicker) {
        this.datePicker.setStartDate(this.activeRange.start);
        this.datePicker.setEndDate(this.activeRange.end);
      }
    }
  }

  ngOnDestroy() {
    this.destroyPicker();
  }

  private hexAToRGBA(h) {
    let r = 0; g = 0, b = 0, a = 1;

    if (h.length == 5) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];
      a = "0x" + h[4] + h[4];
    } else if (h.length == 9) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
      a = "0x" + h[7] + h[8];
    } else if (h.length == 7) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
      a = "0x01"
    } else if (h.length == 4) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
      a = "0x01";
    }
    a = +(a / 255).toFixed(3);
    this.setRootVariables(r, g, b)

    return "rgba(" + +r + "," + +g + "," + +b + "," + a + ")";
  }

  private setRootVariables(r, g, b) {
    document.documentElement.style.setProperty('--red', r);
    document.documentElement.style.setProperty('--green', g);
    document.documentElement.style.setProperty('--blue', b);
  }

  private render(): void {
    this.targetOptions = Object.assign({}, this.config.settings, this.options);

    (<any>$(this.input.nativeElement)).daterangepicker(
      this.targetOptions,
      this.callback.bind(this)
    );

    if (this.options.customClasses && this.options.customClasses.length) {
      for (let customClass of this.options.customClasses) {
        this.datePicker = (
          <any>$(this.input.nativeElement)
        ).data('daterangepicker').container.addClass(customClass);
      }
    } else {
      this.datePicker = (
        <any>$(this.input.nativeElement)
      ).data('daterangepicker');
    }
  }

  private callback(start?: any, end?: any, label?: any): void {
    this.activeRange = {
      start: start,
      end: end,
      label: label
    }

    this.selected.emit(this.activeRange);
  }

  private destroyPicker(): void {
    try {
      $(this.input.nativeElement).data('daterangepicker').remove();
    } catch (e) {
      console.log(e.message);
    }
  }

  private attachEvents(): void {
    $(this.input.nativeElement).on('cancel.daterangepicker',
      (e: any, picker: any) => {
        let event = { event: e, picker: picker };
        this.cancelDaterangepicker.emit(event);
      }
    );

    $(this.input.nativeElement).on('apply.daterangepicker',
      (e: any, picker: any) => {
        let event = { event: e, picker: picker };
        this.applyDaterangepicker.emit(event);
      }
    );

    $(this.input.nativeElement).on('hideCalendar.daterangepicker',
      (e: any, picker: any) => {
        let event = { event: e, picker: picker };
        this.hideCalendarDaterangepicker.emit(event);
      }
    );

    $(this.input.nativeElement).on('showCalendar.daterangepicker',
      (e: any, picker: any) => {
        let event = { event: e, picker: picker };
        this.showCalendarDaterangepicker.emit(event);
      }
    );

    $(this.input.nativeElement).on('hide.daterangepicker',
      (e: any, picker: any) => {
        let event = { event: e, picker: picker };
        this.hideDaterangepicker.emit(event);
      }
    );

    $(this.input.nativeElement).on('show.daterangepicker',
      (e: any, picker: any) => {
        let event = { event: e, picker: picker };
        if (this.targetOptions.autoPosition && picker) {
          this.autoPositionDatepicker(picker);
        }
        this.showDaterangepicker.emit(event);
      }
    );
  }

  public autoPositionDatepicker(datePicker: any) {
    const $container = datePicker.container;
    const $ele = datePicker.element;

    if (!$container || !$ele) {
      return;
    }

    // auto vertical positioning
    const topSpacing = $ele.offset().top;
    const bottomSpacing = window.innerHeight - topSpacing - $ele.height();
    datePicker.drops = topSpacing > bottomSpacing ? 'up' : 'down';

    // auto horizontal positioning
    const leftSpacing = $ele.offset().left;
    const rightSpacing = window.innerWidth - leftSpacing - $ele.width();
    datePicker.opens = leftSpacing > rightSpacing ? 'left' : 'right';
    $container.removeClass('opensleft opensright openscenter');
    $container.addClass(`opens${datePicker.opens}`);

    datePicker.move();
  }
}
