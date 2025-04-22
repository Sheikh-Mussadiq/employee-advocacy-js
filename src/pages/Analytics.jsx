import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { ArrowUpDown, Download, FileSpreadsheet } from 'lucide-react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format, subDays, subMonths, subYears } from 'date-fns';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../lib/supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MOCK_DATA = Array.from({ length: 50 }, (_, i) => ({
  date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
  author: `Author ${i % 5 + 1}`,
  title: `Post Title ${i + 1}`,
  network: ['linkedin', 'twitter', 'facebook'][i % 3],
  potentialReach: Math.floor(Math.random() * 10000),
  engagement: Math.floor(Math.random() * 1000),
  earnedMediaValue: Math.floor(Math.random() * 1000),
  likes : Math.floor(Math.random() * 1000),
  shares : Math.floor(Math.random() * 1000),
  comments : Math.floor(Math.random() * 1000),
}));

const MOCK_LINKEDIN_DATA = {
  locations: [
    { city: 'London', count: 2500 },
    { city: 'New York', count: 2000 },
    { city: 'San Francisco', count: 1800 },
    { city: 'Berlin', count: 1500 },
    { city: 'Paris', count: 1200 },
  ],
  industries: [
    { name: 'Technology', percentage: 35 },
    { name: 'Financial Services', percentage: 25 },
    { name: 'Manufacturing', percentage: 15 },
    { name: 'Healthcare', percentage: 15 },
    { name: 'Others', percentage: 10 },
  ],
  companySizes: [
    { range: '1-50', percentage: 15 },
    { range: '100-500', percentage: 25 },
    { range: '500-1,000', percentage: 20 },
    { range: '1,000-10,000', percentage: 25 },
    { range: '10,000-50,000', percentage: 10 },
    { range: '50,000+', percentage: 5 },
  ],
  jobTitles: [
    { title: 'Marketing Manager', count: 850 },
    { title: 'Sales Manager', count: 720 },
    { title: 'Head of Finance', count: 500 },
    { title: 'Purchasing Manager', count: 450 },
    { title: 'Product Manager', count: 400 },
  ],
};

const KPI_OPTIONS = [
  { value: 'earnedMediaValue', label: 'Earned Media Value' },
  { value: 'potentialReach', label: 'Potential Reach' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'likes', label: 'Likes' },
  { value: 'shares', label: 'Shares' },
];

const NETWORK_OPTIONS = [
  { value: 'all', label: 'All Networks' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
];

const TIME_RANGE_OPTIONS = [
  { value: '30d', label: 'Last 30 Days' },
  { value: '1m', label: 'Last Month' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
];

import { useAuth } from '../context/AuthContext';
export default function Analytics() {
  const [selectedKPI, setSelectedKPI] = useState(KPI_OPTIONS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORK_OPTIONS[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(TIME_RANGE_OPTIONS[0]);
  const [dateRange, setDateRange] = useState([
    subDays(new Date(), 30),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;
  const { authUser , currentUser, workSpace} = useAuth();

  const kpiData = {
    labels: MOCK_DATA.slice(0, 30).map(item => item.date),
    datasets: [
      {
        label: selectedKPI.label,
        data: MOCK_DATA.slice(0, 30).map(item => item[selectedKPI.value]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const locationData = {
    labels: MOCK_LINKEDIN_DATA.locations.map(item => item.city),
    datasets: [{
      data: MOCK_LINKEDIN_DATA.locations.map(item => item.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
    }],
  };

  const industryData = {
    labels: MOCK_LINKEDIN_DATA.industries.map(item => item.name),
    datasets: [{
      data: MOCK_LINKEDIN_DATA.industries.map(item => item.percentage),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
    }],
  };

  const companySizeData = {
    labels: MOCK_LINKEDIN_DATA.companySizes.map(item => item.range),
    datasets: [{
      data: MOCK_LINKEDIN_DATA.companySizes.map(item => item.percentage),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
      ],
    }],
  };

  const jobTitlesData = {
    labels: MOCK_LINKEDIN_DATA.jobTitles.map(item => item.title),
    datasets: [{
      label: 'Number of Professionals',
      data: MOCK_LINKEDIN_DATA.jobTitles.map(item => item.count),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
    }],
  };

  const exportToExcel = async () => {
    // const workbook = new ExcelJS.Workbook();
    // const createStyledSheet = (sheetName, data) => {
    //     const sheet = workbook.addWorksheet(sheetName);

    //     // Add header row with styling
    //     const headers = Object.keys(data[0] || {});
    //     const headerRow = sheet.addRow(headers);

    //     headerRow.eachCell((cell) => {
    //         cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    //         cell.fill = {
    //             type: 'pattern',
    //             pattern: 'solid',
    //             fgColor: { argb: '4F81BD' }, // Blue background
    //         };
    //         cell.alignment = { horizontal: 'center', vertical: 'middle' };
    //     });

    //     // Add data rows
    //     data.forEach(row => sheet.addRow(Object.values(row)));

    //     // Auto-fit column widths
    //     sheet.columns.forEach((col, i) => {
    //         let maxLength = headers[i].length;
    //         col.eachCell({ includeEmpty: true }, cell => {
    //             maxLength = Math.max(maxLength, cell.value ? cell.value.toString().length : 0);
    //         });
    //         col.width = maxLength + 2;
    //     });

    //     // Apply borders
    //     sheet.eachRow((row) => {
    //         row.eachCell((cell) => {
    //             cell.border = {
    //                 top: { style: 'thin' },
    //                 left: { style: 'thin' },
    //                 bottom: { style: 'thin' },
    //                 right: { style: 'thin' }
    //             };
    //         });
    //     });
    // };

    // // Create and style sheets
    // createStyledSheet('Post Analytics', MOCK_DATA);
    // createStyledSheet('Locations', MOCK_LINKEDIN_DATA.locations);
    // createStyledSheet('Industries', MOCK_LINKEDIN_DATA.industries);
    // createStyledSheet('Company Sizes', MOCK_LINKEDIN_DATA.companySizes);
    // createStyledSheet('Job Titles', MOCK_LINKEDIN_DATA.jobTitles);

    // // Save the file
    // const buffer = await workbook.xlsx.writeBuffer();
    // const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = 'Styled_Analytics_Report.xlsx';
    // link.click();
    try {
      const { data, error } = await supabase
        .from('channels')
        .upsert([
          {
            name: 'Mussadiqs Channel',
            status: false,
            feedslink: 'https://example.com/feed',
            // workspace_id: workSpace.id
          }
        ])
        .eq('id', '92be1357-6a1b-4058-96f7-dec025ac1fc4');
      if (error) throw error;
      console.log('Channel inserted successfully:', data);
    } catch (error) {
      console.error('Error inserting channel:', error.message);
    }

  
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;

    doc.setFontSize(20);
    doc.text('Analytics Report', 20, yOffset);
    yOffset += 20;

    doc.setFontSize(16);
    doc.text('Key Performance Indicators', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(12);
    doc.text(`Earned Media Value: $12,345 (+15%)`, 20, yOffset);
    yOffset += 7;
    doc.text(`Total Reach: 45.2K (+8%)`, 20, yOffset);
    yOffset += 7;
    doc.text(`Engagement Rate: 3.8% (-2%)`, 20, yOffset);
    yOffset += 15;

    doc.setFontSize(16);
    doc.text('Post Analytics', 20, yOffset);
    yOffset += 10;

    const tableData = MOCK_DATA.slice(0, 10).map(item => [
      item.date,
      item.author,
      item.title,
      item.network,
      item.potentialReach.toString(),
      item.engagement.toString(),
      item.earnedMediaValue.toString(),
    ]);

    doc.autoTable({
      head: [['Date', 'Author', 'Title', 'Network', 'Reach', 'Engagement', 'Value']],
      body: tableData,
      startY: yOffset,
    });

    doc.addPage();
    yOffset = 10;

    doc.setFontSize(16);
    doc.text('LinkedIn Audience Insights', 20, yOffset);
    yOffset += 15;

    doc.setFontSize(14);
    doc.text('Top Locations', 20, yOffset);
    yOffset += 10;

    const locationData = MOCK_LINKEDIN_DATA.locations.map(item => [
      item.city,
      item.count.toString(),
    ]);

    doc.autoTable({
      head: [['City', 'Count']],
      body: locationData,
      startY: yOffset,
    });

    doc.save('complete_analytics_report.pdf');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-design-black">Analytics</h2>
        <p className="text-design-primaryGrey mt-1">Employee Advocacy Performance</p>
      </motion.div>

      <motion.div 
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={exportToExcel}
          className="btn-secondary flex items-center gap-2"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Export to Excel
        </button>
        <button
          onClick={exportToPDF}
          className="btn-secondary flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Export to PDF
        </button>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {[
          {
            title: 'Earned Media Value',
            value: '$12.3K',
            change: '+15%',
            trend: 'up',
            rawValue: 12300
          },
          {
            title: 'Potential Reach',
            value: '45.2K',
            change: '+8%',
            trend: 'up',
            rawValue: 45200
          },
          {
            title: 'Engagement Rate',
            value: '3.8%',
            change: '-2%',
            trend: 'down',
            rawValue: 3.8
          },
          {
            title: 'Shares',
            value: '856',
            change: '+15%',
            trend: 'up',
            rawValue: 856
          },
          {
            title: 'Likes',
            value: '2.1K',
            change: '+12%',
            trend: 'up',
            rawValue: 2100
          },
          {
            title: 'Comments',
            value: '432',
            change: '+8%',
            trend: 'up',
            rawValue: 432
          }
        ].map(({ title, value, change, trend, rawValue }) => (
          <motion.div
            key={title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="card p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-design-black">{title}</h3>
              <ArrowUpDown className={`w-5 h-5 ${
                trend === 'up' ? 'text-semantic-success' : 'text-semantic-error'
              }`} />
            </div>
            <p className="text-3xl font-bold mt-2 text-design-black">
              <CountUp
                end={rawValue}
                duration={2}
                separator=","
                decimals={title === 'Engagement Rate' ? 1 : 0}
                suffix={title === 'Engagement Rate' ? '%' : ''}
                prefix={title === 'Earned Media Value' ? '$' : ''}
              />
            </p>
            <p className={`text-sm mt-1 ${
              trend === 'up' ? 'text-semantic-success' : 'text-semantic-error'
            }`}>{change} from last month</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-48">
            <Select
              value={selectedKPI}
              onChange={(option) => setSelectedKPI(option)}
              options={KPI_OPTIONS}
              className="w-full"
            />
          </div>
          <div className="w-48">
            <Select
              value={selectedNetwork}
              onChange={(option) => setSelectedNetwork(option)}
              options={NETWORK_OPTIONS}
              className="w-full"
            />
          </div>
          <div className="w-48">
            <Select
              value={selectedTimeRange}
              onChange={(option) => setSelectedTimeRange(option)}
              options={TIME_RANGE_OPTIONS}
              className="w-full"
            />
          </div>
          {selectedTimeRange.value === 'custom' && (
            <div className="w-72">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>

        <div className="h-80">
          <Line
            data={kpiData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Performance Over Time',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-6">Post Insights</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Author</th>
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Network</th>
                <th className="pb-3 font-medium text-right">Reach</th>
                <th className="pb-3 font-medium text-right">Engagement</th>
                <th className="pb-3 font-medium text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DATA.slice(0, 10).map((post, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-3">{post.date}</td>
                  <td className="py-3">{post.author}</td>
                  <td className="py-3">{post.title}</td>
                  <td className="py-3 capitalize">{post.network}</td>
                  <td className="py-3 text-right">{post.potentialReach.toLocaleString()}</td>
                  <td className="py-3 text-right">{post.engagement.toLocaleString()}</td>
                  <td className="py-3 text-right">${post.earnedMediaValue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-6">LinkedIn Audience Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-medium mb-4">Location Distribution</h4>
            <div className="h-64">
              <Doughnut
                data={locationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Industry Distribution</h4>
            <div className="h-64">
              <Doughnut
                data={industryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Company Size Distribution</h4>
            <div className="h-64">
              <Doughnut
                data={companySizeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Top Job Titles</h4>
            <div className="h-64">
              <Bar
                data={jobTitlesData}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}