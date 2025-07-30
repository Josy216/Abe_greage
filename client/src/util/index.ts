// Dashboard Data
export const dashboardData = [
  {
    description: 'OPEN FOR ALL',
    title: 'All Orders',
    linkText: 'LIST OF ORDERS +',
    link: '/admin/orders',
    icon: 'flaticon-power',
  },
  {
    description: 'OPEN FOR LEADS',
    title: 'New Orders',
    linkText: 'ADD ORDER +',
    link: '/admin/order',
    icon: 'flaticon-gearbox',
  },
  {
    description: 'OPEN FOR ADMINS',
    title: 'Employees',
    linkText: 'LIST OF EMPLOYEES +',
    link: '/admin/employees',
    icon: 'flaticon-brake-disc',
  },
  {
    description: 'OPEN FOR ADMINS',
    title: 'Add Employees',
    linkText: 'ADD EMPLOYEE +',
    link: '/admin/add-employee',
    icon: 'flaticon-car-engine',
  },
  {
    description: 'SERVICE AND REPAIRS',
    title: 'Engine Service & Repair',
    linkText: 'READ MORE +',
    link: '/admin/services',
    icon: 'flaticon-tire',
  },
  {
    description: 'SERVICE AND REPAIRS',
    title: 'All Customers',
    linkText: 'LIST OF CUSTOMERS +',
    link: '/admin/customers',
    icon: 'flaticon-spray-gun',
  },
  {
    description: 'SERVICE AND REPAIRS',
    title: 'New Customer',
    linkText: 'ADD CUSTOMER +',
    link: '/admin/add-customer',
    icon: 'flaticon-spray-gun',
  },
  {
    description: 'SERVICE AND REPAIRS',
    title: 'New Service',
    linkText: 'ADD SERVICE +',
    link: '/admin/services',
    icon: 'flaticon-spray-gun',
  },
  {
    description: 'SERVICE AND REPAIRS',
    title: 'Tyre & Wheels',
    linkText: 'READ MORE +',
    link: '/admin/services',
    icon: 'flaticon-spray-gun',
  },
];

export const serviceListData = [
  {
    title: 'Performance Upgrade',
    icon: 'flaticon-power',
    description: `Enhance your vehicle's overall performance with our expert upgrade services.
We focus on optimizing power, efficiency, and handling.
Our technicians use advanced tools and proven techniques.
Experience a smoother, more responsive ride after every visit.
Book now to see the difference a tune-up can make.`,
  },
  {
    title: 'Transmission Services',
    icon: 'flaticon-gearbox',
    description: `Ensure smooth gear shifting with our professional transmission care.
We diagnose and repair common and complex transmission issues.
Regular service helps extend your transmission’s lifespan.
Trust our team to keep your vehicle running seamlessly.
Get in touch to schedule your transmission check-up today.`,
  },
  {
    title: 'Brake Repair & Service',
    icon: 'flaticon-brake-disc',
    description: `Stay safe on the road with reliable brake maintenance.
We inspect, repair, and replace brake components as needed.
Our team ensures optimal stopping power for your vehicle.
Don’t wait for squeaks — proactive service prevents damage.
Contact us to keep your brakes in top condition.`,
  },
  {
    title: 'Engine Service & Repair',
    icon: 'flaticon-car-engine',
    description: `Keep your engine running at peak performance with our care.
We handle diagnostics, repairs, and regular maintenance.
Our team identifies issues early to save you time and money.
Drive confidently knowing your engine is in expert hands.
Schedule your engine service with us today.`,
  },
  {
    title: 'Tyre & Wheels',
    icon: 'flaticon-tire',
    description: `Improve road grip and extend tyre life with our tyre services.
We offer balancing, rotation, and alignment for smooth rides.
Our team checks for wear and recommends the best solutions.
Drive safer and save on fuel with properly maintained wheels.
Visit us to keep your tyres and wheels road-ready.`,
  },
  {
    title: 'Denting & Painting',
    icon: 'flaticon-spray-gun',
    description: `Restore your car’s beauty with our denting and painting services.
We fix scratches, dents, and faded paint with precision.
Our workshop uses modern techniques for a flawless finish.
Bring back that showroom shine with minimal downtime.
Book your appointment today for a fresh new look.`,
  },
];

export const reasons = [
  {
    icon: 'flaticon-mechanic',
    title: 'Certified Expert Mechanics',
  },
  {
    icon: 'flaticon-wrench',
    title: 'Fast And Quality Service',
  },
  {
    icon: 'flaticon-price-tag-1',
    title: 'Best Prices in Town',
  },
  {
    icon: 'flaticon-trophy',
    title: 'Awarded Workshop',
  },
];

export const additionalServices = [
  'General Auto Repair & Maintenance',
  'Transmission Repair & Replacement',
  'Tire Repair and Replacement',
  'State Emissions Inspection',
  'Brake Job / Brake Services',
  'Electrical Diagnostics',
  'Fuel System Repairs',
  'Starting and Charging Repair',
  'Steering and Suspension Work',
  'Emission Repair Facility',
  'Wheel Alignment',
  'Computer Diagnostic Testing',
];

export const aboutText = [
  `Bring to the table win-win survival strategies to ensure proactive domination.
   At the end of the day, going forward, a new normal that has evolved from generation X is on the runway
   heading towards a streamlined cloud solution. User generated content in real-time will have multiple
   touchpoints for offshoring.`,

  `Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.
   Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the
   information highway will close the loop on focusing.`,
];

// Status Map
export const statusMap = {
  pending: { label: 'Pending', color: 'secondary' },
  in_progress: { label: 'In Progress', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
  delayed: { label: 'Delayed', color: 'warning' },
};

export const adminLinks = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/orders', label: 'Orders' },
  { path: '/admin/order', label: 'New Orders' },
  { path: '/admin/add-employee', label: 'Add Employee' },
  { path: '/admin/employees', label: 'Employees' },
  { path: '/admin/add-customer', label: 'Add Customer' },
  { path: '/admin/customers', label: 'Customers' },
  { path: '/admin/services', label: 'Add Service' },
];