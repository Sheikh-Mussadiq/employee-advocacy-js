import React, { useState } from 'react';
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
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

export default function Analytics() {
  const [selectedKPI, setSelectedKPI] = useState(KPI_OPTIONS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORK_OPTIONS[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(TIME_RANGE_OPTIONS[0]);
  const [dateRange, setDateRange] = useState([
    subDays(new Date(), 30),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;

  const kpiData = {
    labels: MOCK_DATA.slice(0, 10).map(item => item.date),
    datasets: [
      {
        label: selectedKPI.label,
        data: MOCK_DATA.slice(0, 10).map(item => item[selectedKPI.value]),
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

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const analyticsWS = XLSX.utils.json_to_sheet(MOCK_DATA);
    XLSX.utils.book_append_sheet(wb, analyticsWS, 'Post Analytics');
    const locationWS = XLSX.utils.json_to_sheet(MOCK_LINKEDIN_DATA.locations);
    XLSX.utils.book_append_sheet(wb, locationWS, 'Locations');
    const industryWS = XLSX.utils.json_to_sheet(MOCK_LINKEDIN_DATA.industries);
    XLSX.utils.book_append_sheet(wb, industryWS, 'Industries');
    const companySizeWS = XLSX.utils.json_to_sheet(MOCK_LINKEDIN_DATA.companySizes);
    XLSX.utils.book_append_sheet(wb, companySizeWS, 'Company Sizes');
    const jobTitlesWS = XLSX.utils.json_to_sheet(MOCK_LINKEDIN_DATA.jobTitles);
    XLSX.utils.book_append_sheet(wb, jobTitlesWS, 'Job Titles');
    XLSX.writeFile(wb, 'complete_analytics_report.xlsx');
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
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600 mt-1">Employee Advocacy Performance</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Export to Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Download className="w-5 h-5" />
            Export to PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Earned Media Value</h3>
            <ArrowUpDown className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-2">$12.3K</p>
          <p className="text-sm text-green-600 mt-1">+15% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Potential Reach</h3>
            <ArrowUpDown className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-2">45.2K</p>
          <p className="text-sm text-green-600 mt-1">+8% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Engagement Rate</h3>
            <ArrowUpDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold mt-2">3.8%</p>
          <p className="text-sm text-red-600 mt-1">-2% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Shares</h3>
            <ArrowUpDown className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-2">856</p>
          <p className="text-sm text-green-600 mt-1">+15% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Likes</h3>
            <ArrowUpDown className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-2">2.1K</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Comments</h3>
            <ArrowUpDown className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-2">432</p>
          <p className="text-sm text-green-600 mt-1">+8% from last month</p>
        </div>
      </div>

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
    </div>
   
  );
}