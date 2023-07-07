'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">stupa documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AccountModule.html" data-type="entity-link" >AccountModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AccountModule-22769ddd5f9ea48406ce79810ac0965b580653dbcc158abe2178f5402c2a99da37dbdde97e494421f3ffd70b3bc306fe2c8f6772dd370cf55b2c2c5cf5f3481c"' : 'data-bs-target="#xs-components-links-module-AccountModule-22769ddd5f9ea48406ce79810ac0965b580653dbcc158abe2178f5402c2a99da37dbdde97e494421f3ffd70b3bc306fe2c8f6772dd370cf55b2c2c5cf5f3481c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AccountModule-22769ddd5f9ea48406ce79810ac0965b580653dbcc158abe2178f5402c2a99da37dbdde97e494421f3ffd70b3bc306fe2c8f6772dd370cf55b2c2c5cf5f3481c"' :
                                            'id="xs-components-links-module-AccountModule-22769ddd5f9ea48406ce79810ac0965b580653dbcc158abe2178f5402c2a99da37dbdde97e494421f3ffd70b3bc306fe2c8f6772dd370cf55b2c2c5cf5f3481c"' }>
                                            <li class="link">
                                                <a href="components/AccountLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccountLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForgotPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForgotPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignUpComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignUpComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerifyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerifyComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link" >AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AdminModule-2e161530becfcbcc2e754922102098e1b01581275edb5a6b3582c90e9d0de4ad44572f9083a8d2373197be04fcdc2086b96105b155d049a2d546be0545909556"' : 'data-bs-target="#xs-components-links-module-AdminModule-2e161530becfcbcc2e754922102098e1b01581275edb5a6b3582c90e9d0de4ad44572f9083a8d2373197be04fcdc2086b96105b155d049a2d546be0545909556"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminModule-2e161530becfcbcc2e754922102098e1b01581275edb5a6b3582c90e9d0de4ad44572f9083a8d2373197be04fcdc2086b96105b155d049a2d546be0545909556"' :
                                            'id="xs-components-links-module-AdminModule-2e161530becfcbcc2e754922102098e1b01581275edb5a6b3582c90e9d0de4ad44572f9083a8d2373197be04fcdc2086b96105b155d049a2d546be0545909556"' }>
                                            <li class="link">
                                                <a href="components/AddFieldDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddFieldDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddWorldRankComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddWorldRankComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminClubDashboardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminClubDashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminPlayerDashboardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminPlayerDashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminSidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminSidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BannerManagementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BannerManagementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChatComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateCategoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateCategoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateMembershipDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateMembershipDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateRoleDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateRoleDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventManagementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventManagementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventVerificationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventVerificationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FeedbacksComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedbacksComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterManagementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterManagementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LiveSettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LiveSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainFooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainFooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MamberComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MamberComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MamberManagementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MamberManagementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MobileappDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MobileappDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlatformHeadersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlatformHeadersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RoleManagementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoleManagementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SampleViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SampleViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupManagementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignupManagementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TermsConditionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TermsConditionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VideosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VideosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewAdminEventComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewAdminEventComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WebImagesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WebImagesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-d101a039521c42d62e138203e0c86ba60de1338d46d3b82fb37ea5e2b7a57ae03b06f2ab6be6b0d8f9781d10aa0a96396a1487c07df8a0e982bee1b968e19826"' : 'data-bs-target="#xs-components-links-module-AppModule-d101a039521c42d62e138203e0c86ba60de1338d46d3b82fb37ea5e2b7a57ae03b06f2ab6be6b0d8f9781d10aa0a96396a1487c07df8a0e982bee1b968e19826"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-d101a039521c42d62e138203e0c86ba60de1338d46d3b82fb37ea5e2b7a57ae03b06f2ab6be6b0d8f9781d10aa0a96396a1487c07df8a0e982bee1b968e19826"' :
                                            'id="xs-components-links-module-AppModule-d101a039521c42d62e138203e0c86ba60de1338d46d3b82fb37ea5e2b7a57ae03b06f2ab6be6b0d8f9781d10aa0a96396a1487c07df8a0e982bee1b968e19826"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LayoutComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BroadcastOnlyModule.html" data-type="entity-link" >BroadcastOnlyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-BroadcastOnlyModule-f151ba877d3aeb3695d88cfa913f31fb4bd3acfe3c4564019743d8a04189cbbf15e467ae5643ca4edcd81f8367e185ff5ff2f00e48f691c5f3f85fe3fd2faeae"' : 'data-bs-target="#xs-components-links-module-BroadcastOnlyModule-f151ba877d3aeb3695d88cfa913f31fb4bd3acfe3c4564019743d8a04189cbbf15e467ae5643ca4edcd81f8367e185ff5ff2f00e48f691c5f3f85fe3fd2faeae"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BroadcastOnlyModule-f151ba877d3aeb3695d88cfa913f31fb4bd3acfe3c4564019743d8a04189cbbf15e467ae5643ca4edcd81f8367e185ff5ff2f00e48f691c5f3f85fe3fd2faeae"' :
                                            'id="xs-components-links-module-BroadcastOnlyModule-f151ba877d3aeb3695d88cfa913f31fb4bd3acfe3c4564019743d8a04189cbbf15e467ae5643ca4edcd81f8367e185ff5ff2f00e48f691c5f3f85fe3fd2faeae"' }>
                                            <li class="link">
                                                <a href="components/BroadcastOnlyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BroadcastOnlyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateMatchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateMatchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TournamentDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TournamentDetailsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link" >DashboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-DashboardModule-9869acb98b418a76a510e23cfa9277e76af2eac66ae0718f676ff061d96285781ae6b824610966a7cc6661e8d44b10e1e3f238e66e46441e482467422313803b"' : 'data-bs-target="#xs-components-links-module-DashboardModule-9869acb98b418a76a510e23cfa9277e76af2eac66ae0718f676ff061d96285781ae6b824610966a7cc6661e8d44b10e1e3f238e66e46441e482467422313803b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardModule-9869acb98b418a76a510e23cfa9277e76af2eac66ae0718f676ff061d96285781ae6b824610966a7cc6661e8d44b10e1e3f238e66e46441e482467422313803b"' :
                                            'id="xs-components-links-module-DashboardModule-9869acb98b418a76a510e23cfa9277e76af2eac66ae0718f676ff061d96285781ae6b824610966a7cc6661e8d44b10e1e3f238e66e46441e482467422313803b"' }>
                                            <li class="link">
                                                <a href="components/CreateDoublesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateDoublesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateMixDouble.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateMixDouble</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateTeamComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateTeamComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardMainComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardMainComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DshboardDoublesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DshboardDoublesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DshboardMixDoublesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DshboardMixDoublesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DshboardSingleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DshboardSingleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DshboardTeamsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DshboardTeamsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FeedBackComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FeedBackComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlayerDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlayerDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportIssueComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReportIssueComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SupportComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SupportComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EventOrganizeModule.html" data-type="entity-link" >EventOrganizeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-EventOrganizeModule-fb4601787943672d40fda0e3286a73eb54cba31f021796d08a36f9b82c72e61d1ea17c7dc3ce118a9ee783a7190b87b722ff1800b732fcec20dc4f760f899220"' : 'data-bs-target="#xs-components-links-module-EventOrganizeModule-fb4601787943672d40fda0e3286a73eb54cba31f021796d08a36f9b82c72e61d1ea17c7dc3ce118a9ee783a7190b87b722ff1800b732fcec20dc4f760f899220"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EventOrganizeModule-fb4601787943672d40fda0e3286a73eb54cba31f021796d08a36f9b82c72e61d1ea17c7dc3ce118a9ee783a7190b87b722ff1800b732fcec20dc4f760f899220"' :
                                            'id="xs-components-links-module-EventOrganizeModule-fb4601787943672d40fda0e3286a73eb54cba31f021796d08a36f9b82c72e61d1ea17c7dc3ce118a9ee783a7190b87b722ff1800b732fcec20dc4f760f899220"' }>
                                            <li class="link">
                                                <a href="components/AddCategoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddCategoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddOfficialComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddOfficialComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddPlayerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddPlayerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AddPlayersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddPlayersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AllotRankPointersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllotRankPointersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Consolation.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Consolation</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateEventComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateEventComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateOfficialComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateOfficialComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DragDropFixtureComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DragDropFixtureComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventOrgSidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventOrgSidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventOrganizComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventOrganizComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventOrganizeLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventOrganizeLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FixDoubleTreeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FixDoubleTreeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FixSingleTreeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FixSingleTreeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FixtureComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FixtureComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GroupCreationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GroupCreationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GrpPlayOffComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GrpPlayOffComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GrpPlayOffConsolidationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GrpPlayOffConsolidationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GrpPlayerSwapComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GrpPlayerSwapComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HistoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImportMemberDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportMemberDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImportPlayerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ImportPlayerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/KnockoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >KnockoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/KnockoutCreationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >KnockoutCreationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LiveStreamComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LiveStreamComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LiveVideosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LiveVideosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainDrawComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainDrawComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MatchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MatchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MatchSchedulerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MatchSchedulerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MergeCategoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MergeCategoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NewScheduleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NewScheduleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OfficialListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OfficialListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaymentMethodComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentMethodComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProsGuidelinesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProsGuidelinesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RankingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RankingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecentRemovedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecentRemovedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecentlyDeletedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecentlyDeletedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrationFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistrationFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultConsolationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultConsolationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultGPlayOffComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultGPlayOffComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultGroupsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultGroupsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultKnockoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultKnockoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultRRobinComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultRRobinComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RoundRobinComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoundRobinComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RuleSettingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RuleSettingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SpecialFixtureComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SpecialFixtureComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StreamMatchesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StreamMatchesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateMatchScoreComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateMatchScoreComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UpdateScoreComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UpdateScoreComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-EventOrganizeModule-fb4601787943672d40fda0e3286a73eb54cba31f021796d08a36f9b82c72e61d1ea17c7dc3ce118a9ee783a7190b87b722ff1800b732fcec20dc4f760f899220"' : 'data-bs-target="#xs-directives-links-module-EventOrganizeModule-fb4601787943672d40fda0e3286a73eb54cba31f021796d08a36f9b82c72e61d1ea17c7dc3ce118a9ee783a7190b87b722ff1800b732fcec20dc4f760f899220"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-EventOrganizeModule-fb4601787943672d40fda0e3286a73eb54cba31f021796d08a36f9b82c72e61d1ea17c7dc3ce118a9ee783a7190b87b722ff1800b732fcec20dc4f760f899220"' :
                                        'id="xs-directives-links-module-EventOrganizeModule-fb4601787943672d40fda0e3286a73eb54cba31f021796d08a36f9b82c72e61d1ea17c7dc3ce118a9ee783a7190b87b722ff1800b732fcec20dc4f760f899220"' }>
                                        <li class="link">
                                            <a href="directives/DragDropItemDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DragDropItemDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/DragDropSwapDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DragDropSwapDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomeModule.html" data-type="entity-link" >HomeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-HomeModule-5392e9b753c810f89cf128002cbbf8c4a44ceaaf21248b972e1d0960e3ad3d52959b332b85deb2d276e438896b9fb24919fe31a1b4503af3236e1d0a6225ba83"' : 'data-bs-target="#xs-components-links-module-HomeModule-5392e9b753c810f89cf128002cbbf8c4a44ceaaf21248b972e1d0960e3ad3d52959b332b85deb2d276e438896b9fb24919fe31a1b4503af3236e1d0a6225ba83"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomeModule-5392e9b753c810f89cf128002cbbf8c4a44ceaaf21248b972e1d0960e3ad3d52959b332b85deb2d276e438896b9fb24919fe31a1b4503af3236e1d0a6225ba83"' :
                                            'id="xs-components-links-module-HomeModule-5392e9b753c810f89cf128002cbbf8c4a44ceaaf21248b972e1d0960e3ad3d52959b332b85deb2d276e438896b9fb24919fe31a1b4503af3236e1d0a6225ba83"' }>
                                            <li class="link">
                                                <a href="components/AllIncompletedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllIncompletedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AllLiveMatchesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllLiveMatchesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AllOngoingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllOngoingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AllRecentsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllRecentsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AllRegistrationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllRegistrationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AllUpcomingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AllUpcomingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BuyMembershipComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BuyMembershipComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LandpageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LandpageComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/IosWebViewModule.html" data-type="entity-link" >IosWebViewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-IosWebViewModule-95030405e7a42285244b43262d1d53276879b8fc01986317e7bde98a9bb5d1c5349e7b1a844ad5f9a8fb88f2244b2c3f7846657c2f20e6731a55dafc9e884ada"' : 'data-bs-target="#xs-components-links-module-IosWebViewModule-95030405e7a42285244b43262d1d53276879b8fc01986317e7bde98a9bb5d1c5349e7b1a844ad5f9a8fb88f2244b2c3f7846657c2f20e6731a55dafc9e884ada"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-IosWebViewModule-95030405e7a42285244b43262d1d53276879b8fc01986317e7bde98a9bb5d1c5349e7b1a844ad5f9a8fb88f2244b2c3f7846657c2f20e6731a55dafc9e884ada"' :
                                            'id="xs-components-links-module-IosWebViewModule-95030405e7a42285244b43262d1d53276879b8fc01986317e7bde98a9bb5d1c5349e7b1a844ad5f9a8fb88f2244b2c3f7846657c2f20e6731a55dafc9e884ada"' }>
                                            <li class="link">
                                                <a href="components/WebViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WebViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LiveMatchesModule.html" data-type="entity-link" >LiveMatchesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LiveMatchesModule-5602dbfa2dd0590fe2767dd4a4f6e126ca865d9cf5c6aa39b8d4831a1a1a963449e11ac245c04cbefc51c7b03cd4d6c6fd176b3e3362df7f18aae29c81c261a8"' : 'data-bs-target="#xs-components-links-module-LiveMatchesModule-5602dbfa2dd0590fe2767dd4a4f6e126ca865d9cf5c6aa39b8d4831a1a1a963449e11ac245c04cbefc51c7b03cd4d6c6fd176b3e3362df7f18aae29c81c261a8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LiveMatchesModule-5602dbfa2dd0590fe2767dd4a4f6e126ca865d9cf5c6aa39b8d4831a1a1a963449e11ac245c04cbefc51c7b03cd4d6c6fd176b3e3362df7f18aae29c81c261a8"' :
                                            'id="xs-components-links-module-LiveMatchesModule-5602dbfa2dd0590fe2767dd4a4f6e126ca865d9cf5c6aa39b8d4831a1a1a963449e11ac245c04cbefc51c7b03cd4d6c6fd176b3e3362df7f18aae29c81c261a8"' }>
                                            <li class="link">
                                                <a href="components/EventMoreVideosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventMoreVideosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventVideosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventVideosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventVideosListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventVideosListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventVideosViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventVideosViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LiveLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LiveLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LiveMatchViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LiveMatchViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LiveMatchesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LiveMatchesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LiveMatchesListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LiveMatchesListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecentVideosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecentVideosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecentVideosListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecentVideosListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecentVideosViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecentVideosViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WttStarContComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WttStarContComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WttStarMatchesListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WttStarMatchesListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WttStarMatchesViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WttStarMatchesViewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MyProfileModule.html" data-type="entity-link" >MyProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-MyProfileModule-57e543786c34b3642074c98e59debad83054a3463dc2ef067beae26d90416ac315c0a89aaabc93a60e6a1fa0d4c3a3034b1cf68f226db2aa3700691c1d3bf4ba"' : 'data-bs-target="#xs-components-links-module-MyProfileModule-57e543786c34b3642074c98e59debad83054a3463dc2ef067beae26d90416ac315c0a89aaabc93a60e6a1fa0d4c3a3034b1cf68f226db2aa3700691c1d3bf4ba"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MyProfileModule-57e543786c34b3642074c98e59debad83054a3463dc2ef067beae26d90416ac315c0a89aaabc93a60e6a1fa0d4c3a3034b1cf68f226db2aa3700691c1d3bf4ba"' :
                                            'id="xs-components-links-module-MyProfileModule-57e543786c34b3642074c98e59debad83054a3463dc2ef067beae26d90416ac315c0a89aaabc93a60e6a1fa0d4c3a3034b1cf68f226db2aa3700691c1d3bf4ba"' }>
                                            <li class="link">
                                                <a href="components/DeteteAccountComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeteteAccountComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MemberShipsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MemberShipsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyEventsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MyEventsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyProfileLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MyProfileLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyProfileSidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MyProfileSidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PersonalDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PersonalDetailsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RankingModule.html" data-type="entity-link" >RankingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-RankingModule-d2915828b119398ee6a79db1ecc1aaf01e4ad2fc032d8f989bf846181d55a72520113be2582198cd0adf10154cfe2d06072cdba415f361dbdb12afb4c8335378"' : 'data-bs-target="#xs-components-links-module-RankingModule-d2915828b119398ee6a79db1ecc1aaf01e4ad2fc032d8f989bf846181d55a72520113be2582198cd0adf10154cfe2d06072cdba415f361dbdb12afb4c8335378"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RankingModule-d2915828b119398ee6a79db1ecc1aaf01e4ad2fc032d8f989bf846181d55a72520113be2582198cd0adf10154cfe2d06072cdba415f361dbdb12afb4c8335378"' :
                                            'id="xs-components-links-module-RankingModule-d2915828b119398ee6a79db1ecc1aaf01e4ad2fc032d8f989bf846181d55a72520113be2582198cd0adf10154cfe2d06072cdba415f361dbdb12afb4c8335378"' }>
                                            <li class="link">
                                                <a href="components/GRankLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GRankLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GlobalRankComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GlobalRankComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegistrationModule.html" data-type="entity-link" >RegistrationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-RegistrationModule-d844471b8be887b049861b6f2c8d7e4adf513f9ab1d6eb6c5508c223bd932c896742b57834b099d299fedf4d40eb17538802c1144a8da112b86dbfc59c43c9e6"' : 'data-bs-target="#xs-components-links-module-RegistrationModule-d844471b8be887b049861b6f2c8d7e4adf513f9ab1d6eb6c5508c223bd932c896742b57834b099d299fedf4d40eb17538802c1144a8da112b86dbfc59c43c9e6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegistrationModule-d844471b8be887b049861b6f2c8d7e4adf513f9ab1d6eb6c5508c223bd932c896742b57834b099d299fedf4d40eb17538802c1144a8da112b86dbfc59c43c9e6"' :
                                            'id="xs-components-links-module-RegistrationModule-d844471b8be887b049861b6f2c8d7e4adf513f9ab1d6eb6c5508c223bd932c896742b57834b099d299fedf4d40eb17538802c1144a8da112b86dbfc59c43c9e6"' }>
                                            <li class="link">
                                                <a href="components/OpenRegistrationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OpenRegistrationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegDoublesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegDoublesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegMixDoublesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegMixDoublesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegSingleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegSingleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegTeamsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegTeamsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' : 'data-bs-target="#xs-components-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' :
                                            'id="xs-components-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' }>
                                            <li class="link">
                                                <a href="components/ConfirmationDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmationDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OrderHistoryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderHistoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisteredComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisteredComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RequestsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RequestsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SocialShareComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SocialShareComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SuccessPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SuccessPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserDetailsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' : 'data-bs-target="#xs-directives-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' :
                                        'id="xs-directives-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' }>
                                        <li class="link">
                                            <a href="directives/PreventCharDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreventCharDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' : 'data-bs-target="#xs-injectables-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' :
                                        'id="xs-injectables-links-module-SharedModule-4f755820595d8ade3e703e9a78cb217422640ebf7c1fdfc1ec05a61904814924e681e25ed5d7517b8d751420ab60cf00e5c882c3ed7974cb695210957a0ab256"' }>
                                        <li class="link">
                                            <a href="injectables/ConfirmationDialogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmationDialogService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TournamentsModule.html" data-type="entity-link" >TournamentsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UttModule.html" data-type="entity-link" >UttModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-UttModule-21da94fd883341f96ea74d473be60caa4093f8fdf205e3787357448d98c4ad93f4cf68159e05accd7e705062e0af3e4143acb96658d1ed7fa6ee8ae89dcd45b3"' : 'data-bs-target="#xs-components-links-module-UttModule-21da94fd883341f96ea74d473be60caa4093f8fdf205e3787357448d98c4ad93f4cf68159e05accd7e705062e0af3e4143acb96658d1ed7fa6ee8ae89dcd45b3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UttModule-21da94fd883341f96ea74d473be60caa4093f8fdf205e3787357448d98c4ad93f4cf68159e05accd7e705062e0af3e4143acb96658d1ed7fa6ee8ae89dcd45b3"' :
                                            'id="xs-components-links-module-UttModule-21da94fd883341f96ea74d473be60caa4093f8fdf205e3787357448d98c4ad93f4cf68159e05accd7e705062e0af3e4143acb96658d1ed7fa6ee8ae89dcd45b3"' }>
                                            <li class="link">
                                                <a href="components/CreateTieComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateTieComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SquadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SquadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UttLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UttLayoutComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ViewerModule.html" data-type="entity-link" >ViewerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ViewerModule-43a3b71c9c360074e5f8663ca241a64f38c4accfc2d9397e1a3fe4dcf881458b918ef1d73500386132b8437216610042707a67a464b783f0faf8b63d90ceb9b0"' : 'data-bs-target="#xs-components-links-module-ViewerModule-43a3b71c9c360074e5f8663ca241a64f38c4accfc2d9397e1a3fe4dcf881458b918ef1d73500386132b8437216610042707a67a464b783f0faf8b63d90ceb9b0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ViewerModule-43a3b71c9c360074e5f8663ca241a64f38c4accfc2d9397e1a3fe4dcf881458b918ef1d73500386132b8437216610042707a67a464b783f0faf8b63d90ceb9b0"' :
                                            'id="xs-components-links-module-ViewerModule-43a3b71c9c360074e5f8663ca241a64f38c4accfc2d9397e1a3fe4dcf881458b918ef1d73500386132b8437216610042707a67a464b783f0faf8b63d90ceb9b0"' }>
                                            <li class="link">
                                                <a href="components/BroadcastVideosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BroadcastVideosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BroadcastViewerResultsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BroadcastViewerResultsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerEventDetailsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerEventDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerFixturesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerFixturesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerGroupCreationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerGroupCreationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerGrpPlayOffComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerGrpPlayOffComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerKnockoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerKnockoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerPlayerListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerPlayerListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerProspectusComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerProspectusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerRankingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerRankingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerRegistrationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerRegistrationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerResultsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerResultsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerRoundRobinComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerRoundRobinComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerTreeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerTreeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ViewerVideosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ViewerVideosComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ArrangeDialogComponent.html" data-type="entity-link" >ArrangeDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CommonScoreComponent.html" data-type="entity-link" >CommonScoreComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CommonSvgMsgComponent.html" data-type="entity-link" >CommonSvgMsgComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CommonUpdateScoreComponent.html" data-type="entity-link" >CommonUpdateScoreComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent-1.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DayPlannerComponent.html" data-type="entity-link" >DayPlannerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GifLoaderComponent.html" data-type="entity-link" >GifLoaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MSGrpPlayOffComponent.html" data-type="entity-link" >MSGrpPlayOffComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MSKnockoutComponent.html" data-type="entity-link" >MSKnockoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MSRoundRobinComponent.html" data-type="entity-link" >MSRoundRobinComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MyAccountComponent.html" data-type="entity-link" >MyAccountComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RoleManagementComponent-1.html" data-type="entity-link" >RoleManagementComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SettingsComponent-1.html" data-type="entity-link" >SettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ToastComponent.html" data-type="entity-link" >ToastComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VideosComponent-1.html" data-type="entity-link" >VideosComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/ContDwnTimerDirective.html" data-type="entity-link" >ContDwnTimerDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/DndDirective.html" data-type="entity-link" >DndDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/DragDropSwapDirective-1.html" data-type="entity-link" >DragDropSwapDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/DragDropSwapDirective-2.html" data-type="entity-link" >DragDropSwapDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/PreventEDirective.html" data-type="entity-link" >PreventEDirective</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AccountService.html" data-type="entity-link" >AccountService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdminFooterService.html" data-type="entity-link" >AdminFooterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdminGrobalLiveService.html" data-type="entity-link" >AdminGrobalLiveService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AllotRankService.html" data-type="entity-link" >AllotRankService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BannerManagementService.html" data-type="entity-link" >BannerManagementService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BroadcastOnlyService.html" data-type="entity-link" >BroadcastOnlyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommonApiService.html" data-type="entity-link" >CommonApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommonService.html" data-type="entity-link" >CommonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfirmationDialogService.html" data-type="entity-link" >ConfirmationDialogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DashboardService.html" data-type="entity-link" >DashboardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DateService.html" data-type="entity-link" >DateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EncyptDecryptService.html" data-type="entity-link" >EncyptDecryptService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorHandlerService.html" data-type="entity-link" >ErrorHandlerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventsService.html" data-type="entity-link" >EventsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FixtureServiceService.html" data-type="entity-link" >FixtureServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JsonDataCallingService.html" data-type="entity-link" >JsonDataCallingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LiveWebService.html" data-type="entity-link" >LiveWebService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MembershipService.html" data-type="entity-link" >MembershipService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MyMonitoringService.html" data-type="entity-link" >MyMonitoringService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlayerServiceService.html" data-type="entity-link" >PlayerServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileLettersService.html" data-type="entity-link" >ProfileLettersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileMenuService.html" data-type="entity-link" >ProfileMenuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RequestServiceService.html" data-type="entity-link" >RequestServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoleService.html" data-type="entity-link" >RoleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RulesSettingService.html" data-type="entity-link" >RulesSettingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SeeAllEventsService.html" data-type="entity-link" >SeeAllEventsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SessionExpireService.html" data-type="entity-link" >SessionExpireService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SocketService.html" data-type="entity-link" >SocketService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ToastService.html" data-type="entity-link" >ToastService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserProfileService.html" data-type="entity-link" >UserProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VideosService.html" data-type="entity-link" >VideosService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/CacheInterceptor.html" data-type="entity-link" >CacheInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthService.html" data-type="entity-link" >AuthService</a>
                            </li>
                            <li class="link">
                                <a href="guards/CheckRoutePermissionService.html" data-type="entity-link" >CheckRoutePermissionService</a>
                            </li>
                            <li class="link">
                                <a href="guards/ConfirmDeactivateGuard.html" data-type="entity-link" >ConfirmDeactivateGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/IsStateFedService.html" data-type="entity-link" >IsStateFedService</a>
                            </li>
                            <li class="link">
                                <a href="guards/RouteAuthService.html" data-type="entity-link" >RouteAuthService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CanComponentDeactivate.html" data-type="entity-link" >CanComponentDeactivate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NgttRound.html" data-type="entity-link" >NgttRound</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NgttRound-1.html" data-type="entity-link" >NgttRound</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NgttTournament.html" data-type="entity-link" >NgttTournament</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NgttTournament-1.html" data-type="entity-link" >NgttTournament</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ToastBreakpoints.html" data-type="entity-link" >ToastBreakpoints</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ToastCloseEvent.html" data-type="entity-link" >ToastCloseEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ToastItemCloseEvent.html" data-type="entity-link" >ToastItemCloseEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ToastTemplates.html" data-type="entity-link" >ToastTemplates</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});