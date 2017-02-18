import App from '../features/home/App';
import { PageNotFound } from '../features/common';
import homeRoute from '../features/home/route';
import commonRoute from '../features/common/route';
import rekitCmdsRoute from '../features/rekit-cmds/route';
import diagramRoute from '../features/diagram/route';
import rekitToolsRoute from '../features/rekit-tools/route';

// NOTE: DO NOT CHANGE the 'childRoutes' name and the declaration pattern.
// This is used for Rekit cmds to register routes for new features, remove features, etc.
const childRoutes = [
  homeRoute,
  commonRoute,
  rekitCmdsRoute,
  diagramRoute,
  rekitToolsRoute,
];

const routes = [{
  path: '/',
  component: App,
  childRoutes: [
    ...childRoutes,
    { path: '*', name: 'Page not found', component: PageNotFound },
  ].filter(r => r.component || (r.childRoutes && r.childRoutes.length > 0)),
}];

// Handle isIndex property of route config:
//  1. remove the first child with isIndex=true if no path property from childRoutes
//  2. assign it to the indexRoute property of the parent.
function handleIndexRoute(route) {
  if (!route.childRoutes || !route.childRoutes.length) {
    return;
  }

  route.childRoutes = route.childRoutes.filter(child => { // eslint-disable-line
    if (child.isIndex) {
      /* istanbul ignore next */
      // if (process.env.NODE_ENV === 'development' && route.indexRoute) {
      //   console.error('More than one index route: ', route);
      // }

      /* istanbul ignore else */
      if (!route.indexRoute) {
        const indexRoute = { ...child };
        delete indexRoute.path;
        route.indexRoute = indexRoute; // eslint-disable-line
        if (!child.path) return false;
      }
    }
    return true;
  });

  route.childRoutes.forEach(handleIndexRoute);
}

routes.forEach(handleIndexRoute);
export default routes;
