import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // -------------------------admin--------------------------------
  {
    path: '/admin/hr',
    component: Layout,
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/admin/HR'),
        name: 'adminHR',
        meta: { title: '人力资源管理', icon: 'el-icon-user' }
      }
    ]
  },

  // {
  //   path: '/admin/account',
  //   component: Layout,
  //   meta: {
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/admin/AccountManagement'),
  //       name: 'account',
  //       meta: { title: 'admin-账号资料', icon: 'el-icon-unlock' }
  //     }
  //   ]
  // },

  // -------------------------hr--------------------------------

  {
    path: '/hr/department',
    component: Layout,
    meta: {
      roles: ['hr', 'admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/hr/Department'),
        name: 'department',
        meta: { title: '部门管理', icon: 'el-icon-help' }
      }
    ]
  },

  {
    path: '/hr/post',
    component: Layout,
    meta: {
      roles: ['hr', 'admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/hr/Post'),
        name: 'post',
        meta: { title: '岗位管理', icon: 'el-icon-s-platform' }
      }
    ]
  },

  {
    path: '/hr/employee',
    component: Layout,
    meta: {
      roles: ['hr', 'admin']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/hr/Employee'),
        name: 'employee',
        meta: { title: '员工管理', icon: 'peoples' }
      }
    ]
  },

  {
    path: '/hr/special',
    component: Layout,
    meta: {
      roles: ['hr']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/hr/Special'),
        name: 'hrSpecial',
        meta: { title: '专项扣除', icon: 'el-icon-aim' }
      }
    ]
  },

  {
    path: '/hr/specialadditional',
    component: Layout,
    meta: {
      roles: ['hr']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/hr/SpecialAdditional'),
        name: 'hrSpecialAdditional',
        meta: { title: '专项附加扣除', icon: 'el-icon-plus' }
      }
    ]
  },

  {
    path: '/hr',
    component: Layout,
    redirect: '/hr/freetax',
    name: 'hrTax',
    meta: {
      title: '纳税管理',
      icon: 'el-icon-money',
      roles: ['hr']
    },
    children: [
      {
        path: 'checkdetail',
        component: () => import('@/views/hr/CheckTaxDetail'),
        name: 'hrCheckDetail',
        meta: { title: '纳税记录', icon: 'el-icon-money' }
      }
      // {
      //   path: 'freetax',
      //   component: () => import('@/views/hr/tax/FreeTax'),
      //   name: 'hrFreeTax',
      //   meta: { title: '免税申请审核', icon: 'el-icon-money' }
      // }
    ]
  },

  {
    path: '/hr/salary',
    component: Layout,
    meta: {
      roles: ['hr']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/hr/Salary'),
        name: 'hrSalary',
        meta: { title: '工资管理', icon: 'money' }
      }
    ]
  },

  // --------------------------employee-------------------------------

  {
    path: '/employee/special',
    component: Layout,
    meta: {
      roles: ['employee']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/employee/Special'),
        name: 'special',
        meta: { title: '专项扣除', icon: 'el-icon-aim' }
      }
    ]
  },

  {
    path: '/employee/specialadditional',
    component: Layout,
    meta: {
      roles: ['employee']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/employee/SpecialAdditional'),
        name: 'specialadditional',
        meta: { title: '专项附加扣除', icon: 'el-icon-plus' }
      }
    ]
  },

  {
    path: '/employee/additional/newapply',
    component: Layout,
    meta: {
      roles: ['employee']
    },
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/employee/NewApply'),
        name: 'NewApply',
        meta: { title: '专项附加扣除申请', icon: 'el-icon-help' }
      }
    ]
  },

  {
    path: '/employee/additional/alterapply',
    component: Layout,
    meta: {
      roles: ['employee']
    },
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/employee/AlterApply'),
        name: 'AlterApply',
        meta: { title: '修改专项附加扣除申请', icon: 'el-icon-help' }
      }
    ]
  },

  // {
  //   path: '/employee/additional/applyrecord',
  //   component: Layout,
  //   meta: {
  //     roles: ['employee']
  //   },
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/employee/ApplyRecord'),
  //       name: 'applyrecord',
  //       meta: { title: '专项附加扣除申请记录', icon: 'el-icon-help' }
  //     }
  //   ]
  // },

  {
    path: '/employee',
    component: Layout,
    redirect: '/employee/freetax',
    name: 'Tax',
    meta: {
      title: '免税管理',
      icon: 'el-icon-money',
      roles: ['employee']
    },
    children: [
      // {
      //   path: 'freetax',
      //   component: () => import('@/views/employee/tax/FreeTax'),
      //   name: 'FreeTax',
      //   meta: { title: '免税申请', icon: 'el-icon-money' }
      // },
      {
        path: 'checkdetail',
        component: () => import('@/views/employee/CheckTaxDetail'),
        name: 'CheckDetail',
        meta: { title: '纳税记录', icon: 'el-icon-money' }
      }
    ]
  },

  {
    path: '/employee/salary',
    component: Layout,
    meta: {
      roles: ['employee']
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/employee/Salary'),
        name: 'Salary',
        meta: { title: '工资管理', icon: 'money' }
      }
    ]
  },

  // ---------------------------------------------------------
  {
    path: '/role',
    component: Layout,
    name: 'role',
    children: [
      {
        path: 'index',
        component: () => import('@/views/role'),
        name: 'roleIndex',
        meta: { title: '-------------', icon: 'el-icon-eleme' }
      }
    ]
  },

  {
    path: '/test',
    component: Layout,
    name: 'test',
    // meta: { roles: ['hr'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/test/Test'),
        name: 'testIndex',
        meta: { title: '测试', icon: 'bug' }
      }
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  // tableRouter,

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
