import React from "react";
import { motion } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const COMPANY_NEWS = [
  {
    id: 1,
    title: "Q4 2023 Financial Results",
    date: "2024-03-15",
    type: "Financial",
  },
  {
    id: 2,
    title: "New Office Opening in Singapore",
    date: "2024-03-12",
    type: "Expansion",
  },
  {
    id: 3,
    title: "Sustainability Report 2023",
    date: "2024-03-10",
    type: "Report",
  },
];

export default function CompanyNews() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="card p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-design-black">Company News</h3>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Building2 className="w-5 h-5 text-blue-500" />
        </motion.div>
      </div>

      <div className="space-y-4">
        {COMPANY_NEWS.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="group p-2 rounded-lg hover:bg-design-greyBG transition-all duration-200 animate-slide-in-right"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-design-black group-hover:text-button-primary-cta transition-colors duration-200">
                  {news.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full inline-block"
                  >
                    {news.type}
                  </motion.span>
                  <span className="text-sm text-design-primaryGrey">
                    {format(new Date(news.date), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-secondary w-full mt-4"
      >
        View All News
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
