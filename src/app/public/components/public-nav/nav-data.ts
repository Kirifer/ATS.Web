export const navbarData = [
    {
        routeLink: '/dashboard',
        label: 'Home',
        visibleWhenLoggedIn: false,
        showInDropdown: false
    },
    {
        routeLink: '/applicant-status',
        label: 'Status',
        visibleWhenLoggedIn: true,
        showInDropdown: false
    },
    {
        routeLink: '/about',
        label: 'About',
        visibleWhenLoggedIn: false,
        showInDropdown: false
    },
    {
        routeLink: '/update-credentials',
        label: 'Settings',
        visibleWhenLoggedIn: true,
        showInDropdown: true
    },
    {
        routeLink: '/public/logout',
        label: 'Logout',
        visibleWhenLoggedIn: true,
        showInDropdown: true
    }
];
