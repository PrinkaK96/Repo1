// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // global_url: 'https://api.stupaevents.com/',
  // global_url: 'https://apitt.stupaevents.com/',
  global_url: 'http://98.71.250.207:8005/',
  tenant_Name: 'stta',
  //  global_url: 'https://api.stupaevents.com/',
  //  global_url: 'https://apitt.stupaevents.com/',
  // global_url: ' https://uatcbtmus.stupaevents.com/',
  // tenant_Name: 'cbtm',
  // tenant_Name: 'tt',
  appInsights: {
    instrumentationKey: '6a6f7ca1-c96e-4c4a-9481-9a695d2370fe'
  },
  // socket_url: 'http://stupa-event-api.stupaanalytics.com:5100',
  socket_url: 'https://stupa-event-api-dev.stupaanalytics.com:5100',
  // socket_url: 'wss://stupa-event-api-dev.stupaanalytics.com:5100',
  isStateFed: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
