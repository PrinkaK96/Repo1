# Stupa - necessary for the project
Angular CLI: 15.0.1
Node: 18.12.1
Package Manager: npm 8.19.2
# This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Folder/Project Structure
[![](https://mermaid.ink/img/pako:eNpt0clqwzAQBuBXEXNOXsCHQovTLS09OLexD1NpEgu0GC2GEPLuVYhL7TQ6CX3_jNDoBNIrhgoOgYZe7OrWibIeMQbZifX64QlpGDpxeyyRYuQUu1uokd2og3eWXWHxr3KDxksyPNHU_yLiGUlKn126dp3TC5Ky2k3XzeUVv4MnJSmmL2eOdxJvaMipgQ58B9_R6JEtJdnz72uWiS02HEYtZ7zwD2x6Cqz-dMGfmHwOjq7zgBVYDpa0KjM_XSpaSD1bbqEqW8V7yia10LpziVJOvjk6CVUKmVeQB0WJa03ltyxUezKRzz-5nowB?type=png)](https://mermaid.live/edit#pako:eNpt0clqwzAQBuBXEXNOXsCHQovTLS09OLexD1NpEgu0GC2GEPLuVYhL7TQ6CX3_jNDoBNIrhgoOgYZe7OrWibIeMQbZifX64QlpGDpxeyyRYuQUu1uokd2og3eWXWHxr3KDxksyPNHU_yLiGUlKn126dp3TC5Ky2k3XzeUVv4MnJSmmL2eOdxJvaMipgQ58B9_R6JEtJdnz72uWiS02HEYtZ7zwD2x6Cqz-dMGfmHwOjq7zgBVYDpa0KjM_XSpaSD1bbqEqW8V7yia10LpziVJOvjk6CVUKmVeQB0WJa03ltyxUezKRzz-5nowB)
  
## Inside Master Folders
app: contains components and services required for the project.
assets: containsimages, JSon files
environments:consists of environment files
locale: consists of translation files.

## src -> app(core)
account: contains all the components related to login, sign-up,forgot password,verify .
admin: contains all the components related to admin module. [For more Information dig into src -> app -> admin].
broadcast-only: contains all the components related to broadcast-only module.
landpage: The home module 
layout: having common header footer component.
live-matches: 
services: used for Http calling 
shared: common component, methods and modules used in whole project.
tournaments: contains all the components related to TMS(Tournament Management System).