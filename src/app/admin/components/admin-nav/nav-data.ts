export const navbarData = [
    {
        routeLink: '/admin/admin-dashboard', // Corrected route to admin-dashboard
        icon: 'fas fa-tachometer-alt',
        label: 'Dashboard'
    },
    {
        routeLink: '/admin/admin-job-candidate-creation', // former recruitment
        icon: 'fas fa-user-plus',
        label: 'New Candidate'
    },
    {
        routeLink: '/admin/admin-job-candidate-existing', //former candidate
        icon: 'fas fa-users',
        label: 'List of Candidates'
    },    
    {
        routeLink: '/admin/admin-job-role-posting', //former jobposting
        icon: 'fas fa-briefcase',
        label: 'Job Posting'
    },
    {
        routeLink: '/admin/admin-job-role-existing', //new
        icon: 'fas fa-clipboard-list',
        label: 'List of Jobs'
    },
    {
        routeLink: '/admin/logout',
        icon: 'fas fa-sign-out-alt',
        label: 'Log Out'
    },
];
