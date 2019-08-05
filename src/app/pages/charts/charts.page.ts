import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as Highcharts from 'highcharts/highstock';
import * as HC_exporting from 'highcharts/modules/exporting';
import { MenuController, LoadingController } from '@ionic/angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DataManagement } from 'src/app/services/dataManagement';

const spanishCompanies = [
  'Acciona',
  'Acerinox',
  'ACS',
  'Aena',
  'Amadeus',
  'ArcelorMittal',
  'B. Sabadell',
  'Bankia',
  'Bankinter',
  'BBVA',
  'Caixabank',
  'Cellnex Telecom',
  'Cie Automotive',
  'Enagas',
  'ENCE',
  'Endesa',
  'Ferrovial',
  'Gamesa',
  'Grifols',
  'IAG',
  'Iberdrola',
  'Inditex',
  'Indra A',
  'Inmobiliaria Colonial',
  'Mapfre',
  'Masmovil Ibercom',
  'Mediaset',
  'Melia Hotels',
  'Merlin Properties SA',
  'Naturgy Energy',
  'Red Electrica',
  'Repsol',
  'Santander',
  'Telefonica',
  'Viscofan'
];
const germanCompanies = [
  'Adidas',
  'Allianz',
  'BASF',
  'Bayer',
  'Beiersdorf AG',
  'BMW ST',
  'Continental AG',
  'Covestro',
  'Daimler',
  'Deutsche Bank AG',
  'Deutsche Boerse',
  'Deutsche Post',
  'Deutsche Telekom AG',
  'E.ON SE',
  'Fresenius SE',
  'Fresenius ST',
  'Heidelbergcement',
  'Henkel VZO',
  'Infineon',
  'Linde PLC',
  'Lufthansa',
  'Merck',
  'Muench. Rueckvers.',
  'RWE AG ST',
  'SAP',
  'Siemens AG',
  'Thyssenkrupp AG',
  'Volkswagen VZO',
  'Vonovia',
  'Wirecard AG'
];

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss']
})
export class ChartsPage implements OnInit {
  stock;
  stockCandle;
  @ViewChild('container') container: ElementRef;
  @ViewChild('containerCandle') containerCandle: ElementRef;
  candlestick = false;
  country;
  company;
  companies = spanishCompanies;
  isMobile;
  data;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    public menuCtrl: MenuController,
    private deviceService: DeviceDetectorService,
    public dm: DataManagement,
    public loadingCtrl: LoadingController
  ) {
    this.onResize();
    if (!this.isMobile) {
      HC_exporting.default(Highcharts);
    }
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.menuCtrl.enable(true);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.isMobile = this.deviceService.isMobile();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const stockprice: string = this.translate.instant('CHARTS.STOCK_PRICE');
      const subtitle: string = this.translate.instant('CHARTS.SUBTITLE');

      this.activatedRoute.paramMap.subscribe(paramMap => {
        this.country = paramMap.get('country');
        this.company = paramMap.get('company');
        if (this.country === null && this.company === null) {
          this.country = 'Spain';
          this.company = 'Acciona';
        }
      });

      this.dm.getChartData(this.company, '1D').then(res => {
        this.data = res;

        this.stock = Highcharts.stockChart(this.container.nativeElement, {
          rangeSelector: {
            buttons: [
              {
                type: 'minute',
                count: 15,
                text: '1m',
                events: {
                  click: () => {
                    this.showLoading();
                    this.dm.getChartData(this.company, '1m').then(res => {
                      this.stock.series[0].update({
                        name: this.company,
                        type: 'areaspline',
                        threshold: null,
                        tooltip: {
                          valueDecimals: 3
                        },
                        data: res
                      });
                    });
                  }
                }
              },
              {
                type: 'minute',
                count: 30,
                text: '5m',
                events: {
                  click: () => {
                    this.showLoading();
                    this.dm.getChartData(this.company, '5m').then(res => {
                      this.stock.series[0].update({
                        name: this.company,
                        type: 'areaspline',
                        threshold: null,
                        tooltip: {
                          valueDecimals: 3
                        },
                        data: res
                      });
                    });
                  }
                }
              },
              {
                type: 'minute',
                count: 60,
                text: '15m',
                events: {
                  click: () => {
                    this.showLoading();
                    this.dm.getChartData(this.company, '15m').then(res => {
                      this.stock.series[0].update({
                        name: this.company,
                        type: 'areaspline',
                        threshold: null,
                        tooltip: {
                          valueDecimals: 3
                        },
                        data: res
                      });
                    });
                  }
                }
              },
              {
                type: 'minute',
                count: 120,
                text: '30m',
                events: {
                  click: () => {
                    this.showLoading();
                    this.dm.getChartData(this.company, '30m').then(res => {
                      this.stock.series[0].update({
                        name: this.company,
                        type: 'areaspline',
                        threshold: null,
                        tooltip: {
                          valueDecimals: 3
                        },
                        data: res
                      });
                    });
                  }
                }
              },
              {
                type: 'day',
                count: 1,
                text: '1h',
                events: {
                  click: () => {
                    this.showLoading();
                    this.dm.getChartData(this.company, '1h').then(res => {
                      this.stock.series[0].update({
                        name: this.company,
                        type: 'areaspline',
                        threshold: null,
                        tooltip: {
                          valueDecimals: 3
                        },
                        data: res
                      });
                    });
                  }
                }
              },
              {
                type: 'week',
                count: 1,
                text: '1D',
                events: {
                  click: () => {
                    this.showLoading();
                    this.dm.getChartData(this.company, '1D').then(res => {
                      this.stock.series[0].update({
                        name: this.company,
                        type: 'areaspline',
                        threshold: null,
                        tooltip: {
                          valueDecimals: 3
                        },
                        data: res
                      });
                    });
                  }
                }
              },
              {
                type: 'month',
                count: 1,
                text: '1W',
                events: {
                  click: () => {
                    this.showLoading();
                    this.stock.series[0].remove();
                    this.dm.getChartData(this.company, '1W').then(res => {
                      this.stock.addSeries({
                        name: this.company,
                        type: 'areaspline',
                        threshold: null,
                        tooltip: {
                          valueDecimals: 3
                        },
                        data: res
                      });
                    });
                  }
                }
              },
              {
                type: 'year',
                count: 1,
                text: '1M',
                events: {
                  click: () => {
                    this.showLoading();
                    this.stock.series[0].remove();
                    this.dm.getChartData(this.company, '1M').then(res => {
                      this.stock.addSeries({
                        name: this.company,
                        type: 'areaspline',
                        threshold: null,
                        tooltip: {
                          valueDecimals: 3
                        },
                        data: res
                      });
                    });
                  }
                }
              }
            ],
            selected: 5,
            inputEnabled: true,
            allButtonsEnabled: true
          },
          chart: {
            zoomType: 'x'
          },
          title: {
            text: this.company + stockprice
          },

          subtitle: {
            text: subtitle
          },

          scrollbar: {
            barBackgroundColor: 'gray',
            barBorderRadius: 7,
            barBorderWidth: 0,
            buttonBackgroundColor: 'gray',
            buttonBorderWidth: 0,
            buttonBorderRadius: 7,
            trackBackgroundColor: 'none',
            trackBorderWidth: 1,
            trackBorderRadius: 8,
            trackBorderColor: '#CCC'
          },

          series: [
            {
              name: this.company,
              type: 'areaspline',
              threshold: null,
              tooltip: {
                valueDecimals: 3
              },
              data: this.data
            }
          ],
          responsive: {
            rules: [
              {
                condition: {
                  maxWidth: 500
                },
                chartOptions: {
                  subtitle: {
                    text: null
                  },
                  navigator: {
                    enabled: false
                  }
                }
              }
            ]
          }
        });

        this.stockCandle = Highcharts.stockChart(
          this.containerCandle.nativeElement,
          {
            rangeSelector: {
              buttons: [
                {
                  type: 'minute',
                  count: 15,
                  text: '1m',
                  events: {
                    click: () => {
                      this.showLoading();
                      this.dm.getChartData(this.company, '1m').then(res => {
                        this.stockCandle.series[0].update({
                          name: this.company,
                          type: 'candlestick',
                          threshold: null,
                          tooltip: {
                            valueDecimals: 3
                          },
                          data: res
                        });
                      });
                    }
                  }
                },
                {
                  type: 'minute',
                  count: 30,
                  text: '5m',
                  events: {
                    click: () => {
                      this.showLoading();
                      this.dm.getChartData(this.company, '5m').then(res => {
                        this.stockCandle.series[0].update({
                          name: this.company,
                          type: 'candlestick',
                          threshold: null,
                          tooltip: {
                            valueDecimals: 3
                          },
                          data: res
                        });
                      });
                    }
                  }
                },
                {
                  type: 'hour',
                  count: 1,
                  text: '15m',
                  events: {
                    click: () => {
                      this.showLoading();
                      this.dm.getChartData(this.company, '15m').then(res => {
                        this.stockCandle.series[0].update({
                          name: this.company,
                          type: 'candlestick',
                          threshold: null,
                          tooltip: {
                            valueDecimals: 3
                          },
                          data: res
                        });
                      });
                    }
                  }
                },
                {
                  type: 'hour',
                  count: 2,
                  text: '30m',
                  events: {
                    click: () => {
                      this.showLoading();
                      this.dm.getChartData(this.company, '30m').then(res => {
                        this.stockCandle.series[0].update({
                          name: this.company,
                          type: 'candlestick',
                          threshold: null,
                          tooltip: {
                            valueDecimals: 3
                          },
                          data: res
                        });
                      });
                    }
                  }
                },
                {
                  type: 'day',
                  count: 1,
                  text: '1h',
                  events: {
                    click: () => {
                      this.showLoading();
                      this.dm.getChartData(this.company, '1h').then(res => {
                        this.stockCandle.series[0].update({
                          name: this.company,
                          type: 'candlestick',
                          threshold: null,
                          tooltip: {
                            valueDecimals: 3
                          },
                          data: res
                        });
                      });
                    }
                  }
                },
                {
                  type: 'week',
                  count: 1,
                  text: '1D',
                  events: {
                    click: () => {
                      this.showLoading();
                      this.dm.getChartData(this.company, '1D').then(res => {
                        this.stockCandle.series[0].update({
                          name: this.company,
                          type: 'candlestick',
                          threshold: null,
                          tooltip: {
                            valueDecimals: 3
                          },
                          data: res
                        });
                      });
                    }
                  }
                },
                {
                  type: 'month',
                  count: 1,
                  text: '1W',
                  events: {
                    click: () => {
                      this.showLoading();
                      this.stockCandle.series[0].remove();
                      this.dm.getChartData(this.company, '1W').then(res => {
                        this.stockCandle.addSeries({
                          name: this.company,
                          type: 'candlestick',
                          threshold: null,
                          tooltip: {
                            valueDecimals: 3
                          },
                          data: res
                        });
                      });
                    }
                  }
                },
                {
                  type: 'year',
                  count: 1,
                  text: '1M',
                  events: {
                    click: () => {
                      this.showLoading();
                      this.stockCandle.series[0].remove();
                      this.dm.getChartData(this.company, '1M').then(res => {
                        this.stockCandle.addSeries({
                          name: this.company,
                          type: 'candlestick',
                          threshold: null,
                          tooltip: {
                            valueDecimals: 3
                          },
                          data: res
                        });
                      });
                    }
                  }
                }
              ],
              selected: 5,
              inputEnabled: true,
              allButtonsEnabled: true
            },
            chart: {
              zoomType: 'x'
            },
            title: {
              text: this.company + stockprice
            },

            subtitle: {
              text: subtitle
            },

            scrollbar: {
              barBackgroundColor: 'gray',
              barBorderRadius: 7,
              barBorderWidth: 0,
              buttonBackgroundColor: 'gray',
              buttonBorderWidth: 0,
              buttonBorderRadius: 7,
              trackBackgroundColor: 'none',
              trackBorderWidth: 1,
              trackBorderRadius: 8,
              trackBorderColor: '#CCC'
            },

            series: [
              {
                name: this.company,
                type: 'candlestick',
                threshold: null,
                tooltip: {
                  valueDecimals: 3
                },
                data: this.data
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    subtitle: {
                      text: null
                    },
                    navigator: {
                      enabled: false
                    }
                  }
                }
              ]
            }
          }
        );
      });
    });
  }

  chartSize(size: string) {
    if (size === 'large') {
      this.container.nativeElement.style.height = '56%';
      this.containerCandle.nativeElement.style.height = '56%';
      const containerWidth = this.container.nativeElement.offsetWidth;
      const containerHeight = this.container.nativeElement.offsetHeight;
      const containerCandleWidth = this.containerCandle.nativeElement
        .offsetWidth;
      const containerCandleHeight = this.containerCandle.nativeElement
        .offsetHeight;
      this.stock.setSize(containerWidth, containerHeight);
      this.stockCandle.setSize(containerCandleWidth, containerCandleHeight);
    } else if (size === 'small') {
      this.stock.setSize(450, 350);
      this.stockCandle.setSize(450, 350);
      this.container.nativeElement.style.height = '37%';
      this.containerCandle.nativeElement.style.height = '37%';
    } else {
      this.container.nativeElement.style.height = '56%';
      this.containerCandle.nativeElement.style.height = '56%';
      if (this.candlestick) {
        this.stockCandle.setSize(null, null);
        const containerWidth = this.container.nativeElement.offsetWidth;
        const containerHeight = this.container.nativeElement.offsetHeight;
        this.stock.setSize(containerWidth, containerHeight);
      } else {
        this.stock.setSize(null, null);
        const containerCandleWidth = this.containerCandle.nativeElement
          .offsetWidth;
        const containerCandleHeight = this.containerCandle.nativeElement
          .offsetHeight;
        this.stockCandle.setSize(containerCandleWidth, containerCandleHeight);
      }
    }
  }

  changeChartMode() {
    this.candlestick = !this.candlestick;
  }
  onChangeCountry() {
    if (this.country === 'Spain') {
      this.companies = spanishCompanies;
    } else {
      this.companies = germanCompanies;
    }
  }

  onChangeCompany() {
    const stockprice: string = this.translate.instant('CHARTS.STOCK_PRICE');

    this.showLoading();
    this.dm.getChartData(this.company, '1D').then(res => {
      this.stock.setTitle({ text: this.company + stockprice });
      this.stockCandle.setTitle({ text: this.company + stockprice });

      this.stock.series[0].update({
        name: this.company,
        type: 'areaspline',
        threshold: null,
        tooltip: {
          valueDecimals: 3
        },
        data: res
      });
      this.stockCandle.series[0].update({
        name: this.company,
        type: 'candlestick',
        threshold: null,
        tooltip: {
          valueDecimals: 3
        },
        data: res
      });
    });
  }

  showLoading() {
    let translation2: string = this.translate.instant('LOGIN.WAIT');
    this.loadingCtrl
      .create({
        message: translation2,
        showBackdrop: true,
        cssClass: 'loadingChart',
        duration: 1500
      })
      .then(loadingEl => {
        loadingEl.present();
      });
  }
}
