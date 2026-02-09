import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3000

// Enable CORS for requests from Vite dev server and GitHub Pages
app.use(
  cors({
    origin: [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Local testing
      'https://ns-ajalbani.github.io', // GitHub Pages
      /^https:\/\/.*\.github\.io$/, // All GitHub Pages domains
    ],
    credentials: true,
  })
)
app.use(express.json())

// Mock data
const MOCK_PROFILES = [
  {
    id: '1',
    name: 'DLP Profiles Configuration',
    type: 'DLP',
    subtype: 'DLP Profiles',
    category: 'Predefined',
    created: '2024-01-15T16:32:00',
    createdBy: 'john.smith@netskope.com',
  },
  {
    id: '2',
    name: 'Fingerprint Rule - Document Match',
    type: 'DLP',
    subtype: 'Fingerprint Rules',
    category: 'Predefined',
    created: '2024-01-10T10:05:00',
    createdBy: 'sarah.johnson@netskope.com',
  },
  {
    id: '3',
    name: 'Malware Detection Profile',
    type: 'Threat Protection',
    subtype: 'Malware Detection',
    category: 'Custom',
    created: '2024-01-05T14:22:00',
    createdBy: 'michael.chen@netskope.com',
  },
  {
    id: '4',
    name: 'Custom Categories Config',
    type: 'Custom Categories',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-12-20T09:45:00',
    createdBy: 'emily.davis@netskope.com',
  },
  {
    id: '5',
    name: 'AWS Destination Profile',
    type: 'Destination',
    subtype: 'Exact',
    category: 'Predefined',
    created: '2023-12-15T17:18:00',
    createdBy: 'james.wilson@netskope.com',
  },
  {
    id: '6',
    name: 'Salesforce Instance Config',
    type: 'App Instance',
    subtype: 'New App',
    category: 'Predefined',
    created: '2023-12-10T11:30:00',
    createdBy: 'lisa.martinez@netskope.com',
  },
  {
    id: '7',
    name: 'API Request Header',
    type: 'HTTP Header',
    subtype: 'Request',
    category: 'Custom',
    created: '2023-12-05T13:42:00',
    createdBy: 'david.thompson@netskope.com',
  },
  {
    id: '8',
    name: 'Internal Domain Config',
    type: 'Domain',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-11-30T15:55:00',
    createdBy: 'robert.garcia@netskope.com',
  },
  {
    id: '9',
    name: 'Admin User Profile',
    type: 'User',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2023-11-25T08:20:00',
    createdBy: 'jennifer.lee@netskope.com',
  },
  {
    id: '10',
    name: 'PDF File Type Profile',
    type: 'File',
    subtype: 'File Type',
    category: 'Predefined',
    created: '2023-11-20T12:15:00',
    createdBy: 'christopher.brown@netskope.com',
  },
  {
    id: '11',
    name: 'User Count Constraint',
    type: 'Constraint',
    subtype: 'Users',
    category: 'Custom',
    created: '2023-11-15T18:35:00',
    createdBy: 'patricia.miller@netskope.com',
  },
  {
    id: '12',
    name: 'Quarantine Profile Setup',
    type: 'Quarantine',
    subtype: 'Quarantine Profile',
    category: 'Predefined',
    created: '2023-11-10T10:50:00',
    createdBy: 'mark.anderson@netskope.com',
  },
  {
    id: '13',
    name: 'Legal Hold Active',
    type: 'Legal Hold',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-11-05T14:05:00',
    createdBy: 'karen.taylor@netskope.com',
  },
  {
    id: '14',
    name: 'Forensic Logging Enabled',
    type: 'Forensic',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2023-10-30T16:40:00',
    createdBy: 'thomas.harris@netskope.com',
  },
  {
    id: '15',
    name: 'Remediation Rule',
    type: 'Threat Protection',
    subtype: 'Remediation',
    category: 'Custom',
    created: '2023-10-25T09:12:00',
    createdBy: 'nancy.white@netskope.com',
  },
  {
    id: '16',
    name: 'Network Location Multiple',
    type: 'Network Location',
    subtype: 'Multiple Object',
    category: 'Custom',
    created: '2023-10-20T15:28:00',
    createdBy: 'daniel.clark@netskope.com',
  },
  {
    id: '17',
    name: 'DLP Rules - PCI Compliance',
    type: 'DLP',
    subtype: 'DLP Rules',
    category: 'Predefined',
    created: '2023-10-15T08:45:00',
    createdBy: 'alice.wong@netskope.com',
  },
  {
    id: '18',
    name: 'File Classifier - Source Code',
    type: 'DLP',
    subtype: 'File Classifiers',
    category: 'Custom',
    created: '2023-10-10T11:20:00',
    createdBy: 'brian.foster@netskope.com',
  },
  {
    id: '19',
    name: 'Regex Destination - Internal APIs',
    type: 'Destination',
    subtype: 'Regex',
    category: 'Custom',
    created: '2023-10-05T14:55:00',
    createdBy: 'carol.nguyen@netskope.com',
  },
  {
    id: '20',
    name: 'SkopeIT Import - Box',
    type: 'App Instance',
    subtype: 'From SkopeIT',
    category: 'Predefined',
    created: '2023-09-30T09:10:00',
    createdBy: 'derek.patel@netskope.com',
  },
  {
    id: '21',
    name: 'Response Header - Security',
    type: 'HTTP Header',
    subtype: 'Response',
    category: 'Predefined',
    created: '2023-09-25T16:35:00',
    createdBy: 'elena.rodriguez@netskope.com',
  },
  {
    id: '22',
    name: 'File Hash - Known Threats',
    type: 'File',
    subtype: 'File Hash',
    category: 'Predefined',
    created: '2023-09-20T10:00:00',
    createdBy: 'frank.murphy@netskope.com',
  },
  {
    id: '23',
    name: 'Storage Constraint - 500GB',
    type: 'Constraint',
    subtype: 'Storage',
    category: 'Custom',
    created: '2023-09-15T13:25:00',
    createdBy: 'grace.kim@netskope.com',
  },
  {
    id: '24',
    name: 'Custom Tombstone - Legal Notice',
    type: 'Quarantine',
    subtype: 'Custom Tombstone',
    category: 'Custom',
    created: '2023-09-10T15:40:00',
    createdBy: 'henry.zhao@netskope.com',
  },
  {
    id: '25',
    name: 'Network Location Single - HQ',
    type: 'Network Location',
    subtype: 'Single Object',
    category: 'Predefined',
    created: '2023-09-05T08:15:00',
    createdBy: 'irene.baker@netskope.com',
  },
  {
    id: '26',
    name: 'Connected App - Slack',
    type: 'Connected App/Plugin',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2023-09-01T12:50:00',
    createdBy: 'jack.sullivan@netskope.com',
  },
  {
    id: '27',
    name: 'DLP Profile - HIPAA',
    type: 'DLP',
    subtype: 'DLP Profiles',
    category: 'Predefined',
    created: '2023-08-28T07:30:00',
    createdBy: 'kate.hernandez@netskope.com',
  },
  {
    id: '28',
    name: 'Fingerprint Rule - Spreadsheets',
    type: 'DLP',
    subtype: 'Fingerprint Rules',
    category: 'Custom',
    created: '2023-08-23T14:10:00',
    createdBy: 'liam.jones@netskope.com',
  },
  {
    id: '29',
    name: 'Malware Scan - Advanced Heuristics',
    type: 'Threat Protection',
    subtype: 'Malware Detection',
    category: 'Custom',
    created: '2023-08-18T10:45:00',
    createdBy: 'megan.taylor@netskope.com',
  },
  {
    id: '30',
    name: 'URL List - Blocked Domains',
    type: 'URL Lists',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-08-13T16:20:00',
    createdBy: 'nathan.wright@netskope.com',
  },
  {
    id: '31',
    name: 'Exact Destination - Azure',
    type: 'Destination',
    subtype: 'Exact',
    category: 'Predefined',
    created: '2023-08-08T09:55:00',
    createdBy: 'olivia.scott@netskope.com',
  },
  {
    id: '32',
    name: 'New App Instance - Dropbox',
    type: 'App Instance',
    subtype: 'New App',
    category: 'Custom',
    created: '2023-08-03T13:30:00',
    createdBy: 'peter.adams@netskope.com',
  },
  {
    id: '33',
    name: 'Request Header - Tenant Restrict',
    type: 'HTTP Header',
    subtype: 'Request',
    category: 'Predefined',
    created: '2023-07-29T11:05:00',
    createdBy: 'quinn.ross@netskope.com',
  },
  {
    id: '34',
    name: 'Domain Config - Partner Sites',
    type: 'Domain',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-07-24T15:40:00',
    createdBy: 'rachel.green@netskope.com',
  },
  {
    id: '35',
    name: 'User Profile - Engineering',
    type: 'User',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-07-19T08:20:00',
    createdBy: 'sam.cooper@netskope.com',
  },
  {
    id: '36',
    name: 'File Name/Extension - Executables',
    type: 'File',
    subtype: 'Name/Extension',
    category: 'Predefined',
    created: '2023-07-14T12:55:00',
    createdBy: 'tina.bell@netskope.com',
  },
  {
    id: '37',
    name: 'User Constraint - Max 200',
    type: 'Constraint',
    subtype: 'Users',
    category: 'Custom',
    created: '2023-07-09T17:30:00',
    createdBy: 'victor.reed@netskope.com',
  },
  {
    id: '38',
    name: 'Quarantine - Suspicious Uploads',
    type: 'Quarantine',
    subtype: 'Quarantine Profile',
    category: 'Predefined',
    created: '2023-07-04T10:10:00',
    createdBy: 'wendy.turner@netskope.com',
  },
  {
    id: '39',
    name: 'Legal Hold - Q3 Audit',
    type: 'Legal Hold',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-06-29T14:45:00',
    createdBy: 'xavier.diaz@netskope.com',
  },
  {
    id: '40',
    name: 'Forensic - Incident Response Log',
    type: 'Forensic',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-06-24T09:20:00',
    createdBy: 'yolanda.morris@netskope.com',
  },
  {
    id: '41',
    name: 'DLP Rules - GDPR',
    type: 'DLP',
    subtype: 'DLP Rules',
    category: 'Predefined',
    created: '2023-06-19T11:55:00',
    createdBy: 'zachary.price@netskope.com',
  },
  {
    id: '42',
    name: 'File Classifier - Images',
    type: 'DLP',
    subtype: 'File Classifiers',
    category: 'Predefined',
    created: '2023-06-14T15:30:00',
    createdBy: 'amanda.cox@netskope.com',
  },
  {
    id: '43',
    name: 'Remediation - Auto Quarantine',
    type: 'Threat Protection',
    subtype: 'Remediation',
    category: 'Predefined',
    created: '2023-06-09T08:05:00',
    createdBy: 'brandon.ward@netskope.com',
  },
  {
    id: '44',
    name: 'Custom Categories - Social Media',
    type: 'Custom Categories',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-06-04T12:40:00',
    createdBy: 'christina.brooks@netskope.com',
  },
  {
    id: '45',
    name: 'URL List - Allowed SaaS',
    type: 'URL Lists',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2023-05-30T16:15:00',
    createdBy: 'douglas.james@netskope.com',
  },
  {
    id: '46',
    name: 'Regex Destination - CDN Endpoints',
    type: 'Destination',
    subtype: 'Regex',
    category: 'Custom',
    created: '2023-05-25T10:50:00',
    createdBy: 'evelyn.watson@netskope.com',
  },
  {
    id: '47',
    name: 'SkopeIT Import - Google Workspace',
    type: 'App Instance',
    subtype: 'From SkopeIT',
    category: 'Predefined',
    created: '2023-05-20T14:25:00',
    createdBy: 'felix.morgan@netskope.com',
  },
  {
    id: '48',
    name: 'Response Header - CORS Policy',
    type: 'HTTP Header',
    subtype: 'Response',
    category: 'Custom',
    created: '2023-05-15T09:00:00',
    createdBy: 'gina.powell@netskope.com',
  },
  {
    id: '49',
    name: 'Domain - Vendor Access',
    type: 'Domain',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2023-05-10T13:35:00',
    createdBy: 'harold.butler@netskope.com',
  },
  {
    id: '50',
    name: 'User Profile - Contractors',
    type: 'User',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2023-05-05T17:10:00',
    createdBy: 'iris.sanders@netskope.com',
  },
  {
    id: '51',
    name: 'Object ID - S3 Buckets',
    type: 'File',
    subtype: 'Object ID',
    category: 'Custom',
    created: '2023-04-30T11:45:00',
    createdBy: 'jason.perry@netskope.com',
  },
  {
    id: '52',
    name: 'Storage Constraint - 1TB',
    type: 'Constraint',
    subtype: 'Storage',
    category: 'Predefined',
    created: '2023-04-25T15:20:00',
    createdBy: 'kelly.long@netskope.com',
  },
  {
    id: '53',
    name: 'Custom Tombstone - Policy Block',
    type: 'Quarantine',
    subtype: 'Custom Tombstone',
    category: 'Custom',
    created: '2023-04-20T08:55:00',
    createdBy: 'louis.howard@netskope.com',
  },
  {
    id: '54',
    name: 'Legal Hold - Litigation 2023',
    type: 'Legal Hold',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2023-04-15T13:30:00',
    createdBy: 'maria.ramirez@netskope.com',
  },
  {
    id: '55',
    name: 'Forensic - Data Exfil Monitor',
    type: 'Forensic',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2023-04-10T17:05:00',
    createdBy: 'nicholas.barnes@netskope.com',
  },
  {
    id: '56',
    name: 'Network Location - Branch Offices',
    type: 'Network Location',
    subtype: 'Multiple Object',
    category: 'Predefined',
    created: '2023-04-05T10:40:00',
    createdBy: 'olga.fisher@netskope.com',
  },
  {
    id: '57',
    name: 'Connected App - Zoom',
    type: 'Connected App/Plugin',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2023-03-31T14:15:00',
    createdBy: 'paul.henderson@netskope.com',
  },
  {
    id: '58',
    name: 'DLP Profile - SOX Compliance',
    type: 'DLP',
    subtype: 'DLP Profiles',
    category: 'Custom',
    created: '2023-03-26T08:50:00',
    createdBy: 'rachel.murray@netskope.com',
  },
  {
    id: '59',
    name: 'Fingerprint Rule - Contracts',
    type: 'DLP',
    subtype: 'Fingerprint Rules',
    category: 'Predefined',
    created: '2023-03-21T12:25:00',
    createdBy: 'steven.cole@netskope.com',
  },
  {
    id: '60',
    name: 'Malware Scan - Ransomware Focus',
    type: 'Threat Protection',
    subtype: 'Malware Detection',
    category: 'Predefined',
    created: '2023-03-16T16:00:00',
    createdBy: 'theresa.griffin@netskope.com',
  },
  {
    id: '61',
    name: 'Exact Destination - GCP Services',
    type: 'Destination',
    subtype: 'Exact',
    category: 'Custom',
    created: '2023-03-11T09:35:00',
    createdBy: 'ulysses.hayes@netskope.com',
  },
  {
    id: '62',
    name: 'New App Instance - ServiceNow',
    type: 'App Instance',
    subtype: 'New App',
    category: 'Predefined',
    created: '2023-03-06T13:10:00',
    createdBy: 'valerie.fox@netskope.com',
  },
  {
    id: '63',
    name: 'Request Header - Auth Token',
    type: 'HTTP Header',
    subtype: 'Request',
    category: 'Custom',
    created: '2023-03-01T17:45:00',
    createdBy: 'william.stevens@netskope.com',
  },
  {
    id: '64',
    name: 'File Type - Archives',
    type: 'File',
    subtype: 'File Type',
    category: 'Custom',
    created: '2023-02-24T11:20:00',
    createdBy: 'xena.russell@netskope.com',
  },
  {
    id: '65',
    name: 'URL List - Phishing Domains',
    type: 'URL Lists',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-02-19T14:55:00',
    createdBy: 'yuri.campbell@netskope.com',
  },
  {
    id: '66',
    name: 'Custom Categories - Gambling',
    type: 'Custom Categories',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-02-14T08:30:00',
    createdBy: 'zara.mitchell@netskope.com',
  },
  {
    id: '67',
    name: 'DLP Rules - Credit Card Numbers',
    type: 'DLP',
    subtype: 'DLP Rules',
    category: 'Predefined',
    created: '2023-02-09T12:05:00',
    createdBy: 'adam.phillips@netskope.com',
  },
  {
    id: '68',
    name: 'File Classifier - Audio Files',
    type: 'DLP',
    subtype: 'File Classifiers',
    category: 'Custom',
    created: '2023-02-04T15:40:00',
    createdBy: 'betty.jenkins@netskope.com',
  },
  {
    id: '69',
    name: 'Remediation - Notify Admin',
    type: 'Threat Protection',
    subtype: 'Remediation',
    category: 'Custom',
    created: '2023-01-30T09:15:00',
    createdBy: 'carl.gonzalez@netskope.com',
  },
  {
    id: '70',
    name: 'Regex Destination - Microservices',
    type: 'Destination',
    subtype: 'Regex',
    category: 'Predefined',
    created: '2023-01-25T13:50:00',
    createdBy: 'diana.simmons@netskope.com',
  },
  {
    id: '71',
    name: 'Domain - Customer Portals',
    type: 'Domain',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-01-20T17:25:00',
    createdBy: 'edgar.foster@netskope.com',
  },
  {
    id: '72',
    name: 'User Profile - Sales Team',
    type: 'User',
    subtype: 'N/A',
    category: 'Custom',
    created: '2023-01-15T10:00:00',
    createdBy: 'fiona.reynolds@netskope.com',
  },
  {
    id: '73',
    name: 'File Hash - Blocklist Q1',
    type: 'File',
    subtype: 'File Hash',
    category: 'Custom',
    created: '2023-01-10T14:35:00',
    createdBy: 'george.carter@netskope.com',
  },
  {
    id: '74',
    name: 'User Constraint - Max 500',
    type: 'Constraint',
    subtype: 'Users',
    category: 'Predefined',
    created: '2023-01-05T08:10:00',
    createdBy: 'hannah.wood@netskope.com',
  },
  {
    id: '75',
    name: 'Quarantine - Email Attachments',
    type: 'Quarantine',
    subtype: 'Quarantine Profile',
    category: 'Custom',
    created: '2022-12-31T12:45:00',
    createdBy: 'ivan.flores@netskope.com',
  },
  {
    id: '76',
    name: 'Network Location - VPN Endpoints',
    type: 'Network Location',
    subtype: 'Single Object',
    category: 'Custom',
    created: '2022-12-26T16:20:00',
    createdBy: 'julia.sanders@netskope.com',
  },
  {
    id: '77',
    name: 'Connected App - Teams',
    type: 'Connected App/Plugin',
    subtype: 'N/A',
    category: 'Custom',
    created: '2022-12-21T09:55:00',
    createdBy: 'kevin.ortiz@netskope.com',
  },
  {
    id: '78',
    name: 'Forensic - Compliance Audit Trail',
    type: 'Forensic',
    subtype: 'N/A',
    category: 'Custom',
    created: '2022-12-16T14:30:00',
    createdBy: 'laura.nelson@netskope.com',
  },
  {
    id: '79',
    name: 'Legal Hold - HR Investigation',
    type: 'Legal Hold',
    subtype: 'N/A',
    category: 'Custom',
    created: '2022-12-11T08:05:00',
    createdBy: 'marcus.hill@netskope.com',
  },
  {
    id: '80',
    name: 'DLP Profile - Financial Data',
    type: 'DLP',
    subtype: 'DLP Profiles',
    category: 'Predefined',
    created: '2022-12-06T12:40:00',
    createdBy: 'nancy.rivera@netskope.com',
  },
  {
    id: '81',
    name: 'Fingerprint Rule - Tax Documents',
    type: 'DLP',
    subtype: 'Fingerprint Rules',
    category: 'Custom',
    created: '2022-12-01T16:15:00',
    createdBy: 'oscar.ramirez@netskope.com',
  },
  {
    id: '82',
    name: 'Malware Scan - Zero Day',
    type: 'Threat Protection',
    subtype: 'Malware Detection',
    category: 'Custom',
    created: '2022-11-26T10:50:00',
    createdBy: 'pamela.young@netskope.com',
  },
  {
    id: '83',
    name: 'URL List - Approved Vendors',
    type: 'URL Lists',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2022-11-21T14:25:00',
    createdBy: 'quentin.king@netskope.com',
  },
  {
    id: '84',
    name: 'Custom Categories - Streaming',
    type: 'Custom Categories',
    subtype: 'N/A',
    category: 'Custom',
    created: '2022-11-16T09:00:00',
    createdBy: 'rosa.allen@netskope.com',
  },
  {
    id: '85',
    name: 'Exact Destination - Salesforce',
    type: 'Destination',
    subtype: 'Exact',
    category: 'Predefined',
    created: '2022-11-11T13:35:00',
    createdBy: 'sean.walker@netskope.com',
  },
  {
    id: '86',
    name: 'SkopeIT Import - Office 365',
    type: 'App Instance',
    subtype: 'From SkopeIT',
    category: 'Predefined',
    created: '2022-11-06T17:10:00',
    createdBy: 'tammy.hall@netskope.com',
  },
  {
    id: '87',
    name: 'Response Header - CSP',
    type: 'HTTP Header',
    subtype: 'Response',
    category: 'Predefined',
    created: '2022-11-01T11:45:00',
    createdBy: 'uriel.martinez@netskope.com',
  },
  {
    id: '88',
    name: 'File Name/Extension - Scripts',
    type: 'File',
    subtype: 'Name/Extension',
    category: 'Custom',
    created: '2022-10-27T15:20:00',
    createdBy: 'vera.jackson@netskope.com',
  },
  {
    id: '89',
    name: 'Storage Constraint - 250GB',
    type: 'Constraint',
    subtype: 'Storage',
    category: 'Custom',
    created: '2022-10-22T08:55:00',
    createdBy: 'wayne.thomas@netskope.com',
  },
  {
    id: '90',
    name: 'Quarantine - Cloud Downloads',
    type: 'Quarantine',
    subtype: 'Quarantine Profile',
    category: 'Predefined',
    created: '2022-10-17T13:30:00',
    createdBy: 'xander.lee@netskope.com',
  },
  {
    id: '91',
    name: 'Network Location - Data Centers',
    type: 'Network Location',
    subtype: 'Multiple Object',
    category: 'Custom',
    created: '2022-10-12T17:05:00',
    createdBy: 'yvette.moore@netskope.com',
  },
  {
    id: '92',
    name: 'Connected App - Jira',
    type: 'Connected App/Plugin',
    subtype: 'N/A',
    category: 'Custom',
    created: '2022-10-07T10:40:00',
    createdBy: 'zack.harris@netskope.com',
  },
  {
    id: '93',
    name: 'DLP Rules - SSN Detection',
    type: 'DLP',
    subtype: 'DLP Rules',
    category: 'Predefined',
    created: '2022-10-02T14:15:00',
    createdBy: 'anna.clark@netskope.com',
  },
  {
    id: '94',
    name: 'File Classifier - Video Files',
    type: 'DLP',
    subtype: 'File Classifiers',
    category: 'Custom',
    created: '2022-09-27T08:50:00',
    createdBy: 'ben.lewis@netskope.com',
  },
  {
    id: '95',
    name: 'Remediation - Block and Alert',
    type: 'Threat Protection',
    subtype: 'Remediation',
    category: 'Predefined',
    created: '2022-09-22T12:25:00',
    createdBy: 'cathy.robinson@netskope.com',
  },
  {
    id: '96',
    name: 'Regex Destination - Partner APIs',
    type: 'Destination',
    subtype: 'Regex',
    category: 'Custom',
    created: '2022-09-17T16:00:00',
    createdBy: 'dominic.martinez@netskope.com',
  },
  {
    id: '97',
    name: 'Domain - Subsidiary Domains',
    type: 'Domain',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2022-09-12T09:35:00',
    createdBy: 'elaine.white@netskope.com',
  },
  {
    id: '98',
    name: 'User Profile - Executives',
    type: 'User',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2022-09-07T13:10:00',
    createdBy: 'fernando.garcia@netskope.com',
  },
  {
    id: '99',
    name: 'Object ID - Azure Blobs',
    type: 'File',
    subtype: 'Object ID',
    category: 'Predefined',
    created: '2022-09-02T17:45:00',
    createdBy: 'gwen.anderson@netskope.com',
  },
  {
    id: '100',
    name: 'File Type - Documents',
    type: 'File',
    subtype: 'File Type',
    category: 'Predefined',
    created: '2022-08-28T11:20:00',
    createdBy: 'hector.lopez@netskope.com',
  },
  {
    id: '101',
    name: 'User Constraint - Max 1000',
    type: 'Constraint',
    subtype: 'Users',
    category: 'Predefined',
    created: '2022-08-23T14:55:00',
    createdBy: 'ingrid.peterson@netskope.com',
  },
  {
    id: '102',
    name: 'Custom Tombstone - DMCA Notice',
    type: 'Quarantine',
    subtype: 'Custom Tombstone',
    category: 'Predefined',
    created: '2022-08-18T08:30:00',
    createdBy: 'joel.bennett@netskope.com',
  },
  {
    id: '103',
    name: 'Forensic - Insider Threat Log',
    type: 'Forensic',
    subtype: 'N/A',
    category: 'Custom',
    created: '2022-08-13T12:05:00',
    createdBy: 'kim.nguyen@netskope.com',
  },
  {
    id: '104',
    name: 'Legal Hold - Patent Dispute',
    type: 'Legal Hold',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2022-08-08T15:40:00',
    createdBy: 'leo.stewart@netskope.com',
  },
  {
    id: '105',
    name: 'Network Location - Remote Sites',
    type: 'Network Location',
    subtype: 'Single Object',
    category: 'Predefined',
    created: '2022-08-03T09:15:00',
    createdBy: 'maya.sanchez@netskope.com',
  },
  {
    id: '106',
    name: 'Connected App - Confluence',
    type: 'Connected App/Plugin',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2022-07-29T13:50:00',
    createdBy: 'noel.price@netskope.com',
  },
  {
    id: '107',
    name: 'DLP Profile - Intellectual Property',
    type: 'DLP',
    subtype: 'DLP Profiles',
    category: 'Custom',
    created: '2022-07-24T17:25:00',
    createdBy: 'ophelia.ward@netskope.com',
  },
  {
    id: '108',
    name: 'Fingerprint Rule - Invoices',
    type: 'DLP',
    subtype: 'Fingerprint Rules',
    category: 'Predefined',
    created: '2022-07-19T10:00:00',
    createdBy: 'patrick.foster@netskope.com',
  },
  {
    id: '109',
    name: 'Malware Scan - Phishing Kit',
    type: 'Threat Protection',
    subtype: 'Malware Detection',
    category: 'Predefined',
    created: '2022-07-14T14:35:00',
    createdBy: 'queenie.brooks@netskope.com',
  },
  {
    id: '110',
    name: 'URL List - Developer Tools',
    type: 'URL Lists',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2022-07-09T08:10:00',
    createdBy: 'reginald.coleman@netskope.com',
  },
  {
    id: '111',
    name: 'Exact Destination - Okta SSO',
    type: 'Destination',
    subtype: 'Exact',
    category: 'Predefined',
    created: '2022-07-04T12:45:00',
    createdBy: 'stella.hayes@netskope.com',
  },
  {
    id: '112',
    name: 'New App Instance - Workday',
    type: 'App Instance',
    subtype: 'New App',
    category: 'Custom',
    created: '2022-06-29T16:20:00',
    createdBy: 'troy.duncan@netskope.com',
  },
  {
    id: '113',
    name: 'Request Header - API Key Inject',
    type: 'HTTP Header',
    subtype: 'Request',
    category: 'Custom',
    created: '2022-06-24T09:55:00',
    createdBy: 'uma.patel@netskope.com',
  },
  {
    id: '114',
    name: 'File Hash - Allowlist',
    type: 'File',
    subtype: 'File Hash',
    category: 'Predefined',
    created: '2022-06-19T13:30:00',
    createdBy: 'vernon.cross@netskope.com',
  },
  {
    id: '115',
    name: 'Custom Categories - News Sites',
    type: 'Custom Categories',
    subtype: 'N/A',
    category: 'Predefined',
    created: '2022-06-14T17:05:00',
    createdBy: 'wanda.ellis@netskope.com',
  },
  {
    id: '116',
    name: 'DLP Rules - Passport Numbers',
    type: 'DLP',
    subtype: 'DLP Rules',
    category: 'Custom',
    created: '2022-06-09T10:40:00',
    createdBy: 'xander.shaw@netskope.com',
  },
]

// GET /api/profiles - Server-side pagination and filtering
app.get('/api/profiles', (req, res) => {
  const {
    page = '1',
    pageSize = '10',
    sortField = 'created',
    sortDirection = 'desc',
    type,
    subtype,
    category,
    search,
  } = req.query

  console.log(`\n📡 Received API Request`)
  console.log(
    `   URL: GET /api/profiles?page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}${type ? `&type=${type}` : ''}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`,
  )

  // Apply filters
  let filtered = MOCK_PROFILES.filter(profile => {
    const matchesType = !type || profile.type === type
    const matchesSubtype = !subtype || profile.subtype === subtype
    const matchesCategory = !category || profile.category === category
    const matchesSearch =
      !search ||
      profile.name.toLowerCase().includes(search.toLowerCase()) ||
      profile.type.toLowerCase().includes(search.toLowerCase()) ||
      profile.subtype.toLowerCase().includes(search.toLowerCase())

    return matchesType && matchesSubtype && matchesCategory && matchesSearch
  })

  const total = filtered.length
  console.log(
    `   Filters: type=${type || 'none'}, category=${category || 'none'}, search=${search || 'none'}`,
  )
  console.log(`   Results after filtering: ${total} items`)

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue = ''
    let bValue = ''

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'type':
        aValue = a.type.toLowerCase()
        bValue = b.type.toLowerCase()
        break
      case 'subtype':
        aValue = a.subtype.toLowerCase()
        bValue = b.subtype.toLowerCase()
        break
      case 'category':
        aValue = a.category.toLowerCase()
        bValue = b.category.toLowerCase()
        break
      case 'created':
        aValue = a.created
        bValue = b.created
        break
      case 'createdBy':
        aValue = a.createdBy.toLowerCase()
        bValue = b.createdBy.toLowerCase()
        break
      default:
        aValue = a.created
        bValue = b.created
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Apply pagination
  const pageNum = Math.max(1, parseInt(page))
  const pageSizeNum = Math.max(1, Math.min(100, parseInt(pageSize)))
  const startIndex = (pageNum - 1) * pageSizeNum
  const endIndex = startIndex + pageSizeNum
  const paginatedData = filtered.slice(startIndex, endIndex)

  console.log(
    `   Pagination: page=${pageNum}, pageSize=${pageSizeNum}, returning ${paginatedData.length} items`,
  )
  console.log(`✅ API Response sent\n`)

  res.json({
    data: paginatedData,
    total,
    page: pageNum,
    pageSize: pageSizeNum,
  })
})

// GET /api/profiles/:id - Get single profile
app.get('/api/profiles/:id', (req, res) => {
  const { id } = req.params
  console.log(`\n📡 Received API Request`)
  console.log(`   URL: GET /api/profiles/${id}`)

  const profile = MOCK_PROFILES.find(p => p.id === id)
  if (!profile) {
    console.log(`❌ Profile not found: ${id}\n`)
    return res.status(404).json({ error: 'Profile not found' })
  }

  console.log(`✅ API Response sent - ${profile.name}\n`)
  res.json(profile)
})

// DELETE /api/profiles/:id - Delete a profile
app.delete('/api/profiles/:id', (req, res) => {
  const { id } = req.params
  console.log(`\n📡 Received API Request`)
  console.log(`   URL: DELETE /api/profiles/${id}`)

  const index = MOCK_PROFILES.findIndex(p => p.id === id)
  if (index === -1) {
    console.log(`❌ Profile not found: ${id}\n`)
    return res.status(404).json({ error: 'Profile not found' })
  }

  const deleted = MOCK_PROFILES.splice(index, 1)[0]
  console.log(`✅ Deleted profile: ${deleted.name}\n`)
  res.json({ success: true, deleted })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`)
  console.log(`║   Mock API Server Running              ║`)
  console.log(`║   URL: http://localhost:${PORT}         ║`)
  console.log(`║   Endpoint: GET /api/profiles          ║`)
  console.log(`╚════════════════════════════════════════╝\n`)
  console.log(`Watch this console for API requests!\n`)
})
