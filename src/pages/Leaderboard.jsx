"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import {
  Calendar,
  ArrowDown,
  Crown,
  Medal,
  Award,
  Sparkles,
  Trophy,
  Flame,
  Target,
  Zap,
  Star,
  TrendingUp,
  Shield,
  Gift,
  BadgeCheck,
  Rocket,
  ChevronRight,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const MOCK_USERS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  points: Math.floor(Math.random() * 1000),
  avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
  isMe: i === 42,
  streak: Math.floor(Math.random() * 10),
  badges: Array.from(
    { length: Math.floor(Math.random() * 5) },
    () => ["gold", "silver", "bronze", "special"][Math.floor(Math.random() * 4)]
  ),
})).sort((a, b) => b.points - a.points);

const PRESET_RANGES = [
  {
    label: "This Week",
    getValue: () => {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      return [start, now];
    },
  },
  {
    label: "This Month",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return [start, now];
    },
  },
  {
    label: "Last 30 Days",
    getValue: () => {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      return [start, now];
    },
  },
  {
    label: "Last 90 Days",
    getValue: () => {
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - 90);
      return [start, now];
    },
  },
  {
    label: "This Year",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      return [start, now];
    },
  },
];

const ACHIEVEMENTS = [
  {
    id: "streak",
    icon: Flame,
    label: "On Fire!",
    description: "5 day streak",
    color: "bg-gradient-gold-shine",
  },
  {
    id: "points",
    icon: Target,
    label: "Rising Star",
    description: "500+ points",
    color: "bg-gradient-silver-shine",
  },
  {
    id: "top",
    icon: Crown,
    label: "Top Contributor",
    description: "Ranked #1",
    color: "bg-gradient-bronze-shine",
  },
  {
    id: "engagement",
    icon: Zap,
    label: "Engagement Pro",
    description: "100+ interactions",
    color: "bg-gradient-primary",
  },
];

const BADGES = {
  gold: { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-100" },
  silver: { icon: Medal, color: "text-gray-400", bg: "bg-gray-100" },
  bronze: { icon: Award, color: "text-amber-700", bg: "bg-amber-100" },
  special: { icon: Star, color: "text-purple-500", bg: "bg-purple-100" },
};

const calculateLevel = (points) => Math.floor(Math.sqrt(points / 100)) + 1;
const calculateNextLevelPoints = (level) => Math.pow(level, 2) * 100;

export default function Leaderboard() {
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(1)),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;
  const [isCustomDate, setIsCustomDate] = useState(false);
  const myPositionRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti animation when component mounts
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlePresetRange = (getValue) => {
    setDateRange(getValue());
    setIsCustomDate(false);
  };

  const handleCustomDateChange = (update) => {
    setDateRange(update);
    setIsCustomDate(true);
  };

  const scrollToMyPosition = () => {
    myPositionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const myPosition = MOCK_USERS.findIndex((user) => user.isMe) + 1;
  const myUser = MOCK_USERS.find((user) => user.isMe);
  const myLevel = calculateLevel(myUser?.points || 0);
  const nextLevelPoints = calculateNextLevelPoints(myLevel + 1);
  const currentLevelPoints = calculateNextLevelPoints(myLevel);
  const progressToNextLevel =
    ((myUser?.points - currentLevelPoints) /
      (nextLevelPoints - currentLevelPoints)) *
    100;

  const getPositionMessage = (position) => {
    if (position === 1) return "Champion";
    if (position <= 3) return "Elite";
    if (position <= 10) return "Competitor";
    return "Contributor";
  };

  const getTopRankStyles = (index) => {
    if (index === 0) {
      return {
        background:
          "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
        boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
      };
    }
    if (index === 1) {
      return {
        background:
          "linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 50%, #C0C0C0 100%)",
        boxShadow: "0 0 15px rgba(192, 192, 192, 0.3)",
      };
    }
    if (index === 2) {
      return {
        background:
          "linear-gradient(135deg, #CD7F32 0%, #B8860B 50%, #CD7F32 100%)",
        boxShadow: "0 0 15px rgba(205, 127, 50, 0.3)",
      };
    }
    return {};
  };

  const tabs = [
    { id: "all", label: "All Time" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 pb-24 relative"
    >
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                top: "-10%",
                left: `${Math.random() * 100}%`,
                rotate: 0,
                scale: 0,
              }}
              animate={{
                top: "100%",
                rotate: 360,
                scale: Math.random() * 0.5 + 0.5,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: "easeOut",
                delay: Math.random() * 1,
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: [
                  "#FFD700",
                  "#C0C0C0",
                  "#CD7F32",
                  "#6D28D9",
                  "#22C55E",
                ][Math.floor(Math.random() * 5)],
                zIndex: 10,
              }}
            />
          ))}
        </div>
      )}

      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />

      <motion.div
        className="mb-8 text-center relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-bold bg-gradient-to-br from-design-primaryPurple via-button-primary-cta to-semantic-info bg-clip-text text-transparent drop-shadow-sm">
            Leaderboard
          </h2>
          <button className="text-button-primary-cta hover:underline flex items-center gap-1">
            Rules <span className="text-lg">?</span>
          </button>
        </div>
        <p className="text-design-primaryGrey mt-2 text-lg">
          Compete, Achieve, Lead
        </p>
      </motion.div>

      {/* Tab navigation */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-white rounded-full p-1 shadow-md inline-flex">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-button-primary-cta text-white shadow-md"
                  : "text-design-primaryGrey hover:text-button-primary-cta"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Podium Section */}
      <motion.div className="mb-8 relative">
        <div className="bg-indigo-300 rounded-t-3xl overflow-hidden relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 via-indigo-400 to-indigo-300 opacity-90" />

          {/* Enhanced curved bottom overlay with smooth edges */}
          <div className="absolute -bottom-12 left-0 right-0 h-32">
            {/* Main curve */}
            <div
              className="absolute inset-0 bg-white transform -translate-y-8"
              style={{
                borderTopLeftRadius: "120% 100%",
                borderTopRightRadius: "120% 100%",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 50%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 50%)",
              }}
            />
            {/* Side smoothing layers */}
            <div className="absolute inset-0 transform -translate-y-8">
              <div
                className="absolute left-0 w-1/4 h-full bg-white opacity-60"
                style={{
                  borderTopRightRadius: "100% 100%",
                  transform: "translateX(-20%) translateY(10%)",
                }}
              />
              <div
                className="absolute right-0 w-1/4 h-full bg-white opacity-60"
                style={{
                  borderTopLeftRadius: "100% 100%",
                  transform: "translateX(20%) translateY(10%)",
                }}
              />
            </div>
            {/* Blur overlay for smoother transitions */}
            <div
              className="absolute inset-x-0 top-0 h-16 bg-white/10 backdrop-blur-[2px]"
              style={{
                borderTopLeftRadius: "120% 100%",
                borderTopRightRadius: "120% 100%",
              }}
            />
          </div>

          <div className="flex items-end justify-center relative z-10 h-[350px]">
            {/* Second Place - Left */}
            <div className="flex flex-col items-center h-full pt-16 px-6 pb-0 w-1/3 bg-white/20">
              <div className="text-[100px] font-bold text-white/50 absolute top-0 left-8 opacity-80">
                2
              </div>
              <div className="flex flex-col items-center justify-end h-full w-full">
                <img
                  src={MOCK_USERS[1]?.avatar}
                  alt={MOCK_USERS[1]?.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover z-10"
                />
                <h3 className="text-lg font-bold text-gray-800 mt-3 mb-1">
                  {MOCK_USERS[1]?.name}
                </h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-100 rounded-full p-1.5 shadow-md">
                    <Shield className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <div className="text-blue-700 font-bold mb-1">
                  Earn {MOCK_USERS[1]?.points.toLocaleString()} Points
                </div>
                <div className="bg-blue-300 h-[120px] w-full rounded-t-xl flex items-end justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-blue-400 to-blue-300 opacity-90" />
                </div>
              </div>
            </div>

            {/* First Place - Center */}
            <div className="flex flex-col items-center h-full pt-8 px-8 pb-0 w-1/3 bg-yellow-200/70 z-20">
              <div className="text-[120px] font-bold text-yellow-500/30 absolute top-0 left-1/2 -translate-x-1/2 opacity-80">
                1
              </div>
              <div className="flex flex-col items-center justify-end h-full w-full">
                <img
                  src={MOCK_USERS[0]?.avatar}
                  alt={MOCK_USERS[0]?.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover z-10"
                />
                <h3 className="text-xl font-bold text-gray-800 mt-3 mb-1">
                  {MOCK_USERS[0]?.name}
                </h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-yellow-100 rounded-full p-1.5 shadow-md">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
                <div className="text-yellow-700 font-bold mb-1">
                  Earn {MOCK_USERS[0]?.points.toLocaleString()} Points
                </div>
                <div className="bg-yellow-300 h-[160px] w-full rounded-t-xl flex items-end justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-600 via-yellow-400 to-yellow-300 opacity-90" />
                </div>
              </div>
            </div>

            {/* Third Place - Right */}
            <div className="flex flex-col items-center h-full pt-24 px-6 pb-0 w-1/3 bg-purple-200/50">
              <div className="text-[100px] font-bold text-pink-500/30 absolute top-0 right-8 opacity-80">
                3
              </div>
              <div className="flex flex-col items-center justify-end h-full w-full">
                <img
                  src={MOCK_USERS[2]?.avatar}
                  alt={MOCK_USERS[2]?.name}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover z-10"
                />
                <h3 className="text-lg font-bold text-gray-800 mt-3 mb-1">
                  {MOCK_USERS[2]?.name}
                </h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-purple-100 rounded-full p-1.5 shadow-md">
                    <Medal className="w-5 h-5 text-purple-500" />
                  </div>
                </div>
                <div className="text-purple-700 font-bold mb-1">
                  Earn {MOCK_USERS[2]?.points.toLocaleString()} Points
                </div>
                <div className="bg-purple-300 h-[100px] w-full rounded-t-xl flex items-end justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600 via-purple-400 to-purple-300 opacity-90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Your position highlight card */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg relative overflow-hidden border border-design-greyOutlines"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-secondary opacity-10" />

            <div className="flex items-center gap-6 relative">
              <motion.div
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
              >
                <img
                  src={myUser?.avatar || "/placeholder.svg"}
                  alt="Your avatar"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-button-primary-cta ring-offset-2 shadow-lg"
                />
                <motion.div
                  className="absolute -top-2 -right-2 bg-button-primary-cta text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  <Trophy className="w-4 h-4" />
                </motion.div>
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-design-black">
                    Your Position: #{myPosition}
                  </h3>
                  <motion.span
                    className="bg-button-tertiary-fill text-button-primary-cta px-3 py-1 rounded-full text-sm font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {getPositionMessage(myPosition)}
                  </motion.span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-button-primary-cta" />
                  <span className="text-design-primaryGrey">
                    {myUser?.points.toLocaleString()} points
                  </span>
                  <span className="text-design-primaryGrey">•</span>
                  <Flame className="w-4 h-4 text-semantic-warning" />
                  <span className="text-design-primaryGrey">
                    {myUser?.streak} day streak
                  </span>
                </div>

                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-design-primaryGrey">
                      Level {myLevel}
                    </div>
                    <div className="text-xs text-design-primaryGrey">
                      {myUser?.points - currentLevelPoints}/
                      {nextLevelPoints - currentLevelPoints} XP to Level{" "}
                      {myLevel + 1}
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-design-greyBG">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNextLevel}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-primary rounded-full"
                    />
                  </div>
                </div>
              </div>

              <motion.button
                onClick={scrollToMyPosition}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-button-primary-cta text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:bg-button-primary-hover transition-colors"
              >
                <ArrowDown className="w-4 h-4" />
                <span>View in List</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg text-gray-600 text-sm font-medium border border-gray-100">
              <div className="w-20 text-center">Rank</div>
              <div className="flex-1 text-center">Mentor Name</div>
              <div className="w-20 text-center">Badge</div>
              <div className="w-32 text-right">Total Points</div>
            </div>
            {MOCK_USERS.slice(3).map((user, index) => (
              <motion.div
                key={user.id}
                ref={user.isMe ? myPositionRef : null}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3 }}
                className={`relative overflow-hidden rounded-xl ${
                  user.isMe
                    ? "bg-button-tertiary-fill border-2 border-button-primary-cta shadow-lg"
                    : index < 3
                    ? "hover:shadow-xl"
                    : "bg-white hover:bg-gradient-card"
                } transition-all duration-300`}
                style={index < 3 ? getTopRankStyles(index) : {}}
              >
                {index < 3 && (
                  <div className="absolute inset-0 bg-shimmer animate-shimmer" />
                )}

                <div className="relative p-4 flex items-center gap-4">
                  <div className="text-xl font-bold text-gray-500 w-20 text-center">
                    {index + 4}
                  </div>

                  <div className="relative">
                    <motion.img
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                    />
                    {index === 0 && (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 2,
                        }}
                        className="absolute -top-2 -right-2"
                      >
                        <Crown className="w-6 h-6 text-yellow-500 drop-shadow-lg" />
                      </motion.div>
                    )}
                    {user.streak >= 3 && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 1.5,
                        }}
                        className="absolute -bottom-1 -right-1 bg-semantic-warning-light rounded-full p-1"
                      >
                        <Flame className="w-4 h-4 text-semantic-warning" />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-design-black">
                        {user.name}
                      </h3>
                      <span className="text-xs bg-button-tertiary-fill text-button-primary-cta px-2 py-0.5 rounded-full">
                        Level {calculateLevel(user.points)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xl font-semibold text-gray-700 w-32 text-right">
                        {user.points.toLocaleString()}
                      </div>

                      {user.badges && user.badges.length > 0 && (
                        <div className="w-20 flex justify-center">
                          <div className="flex -space-x-1">
                            {user.badges.slice(0, 3).map((badge, i) => {
                              const BadgeIcon = BADGES[badge].icon;
                              return (
                                <motion.div
                                  key={i}
                                  whileHover={{ scale: 1.2, y: -5 }}
                                  className={`${BADGES[badge].bg} ${BADGES[badge].color} p-1 rounded-full w-6 h-6 flex items-center justify-center ring-1 ring-white`}
                                >
                                  <BadgeIcon className="w-3 h-3" />
                                </motion.div>
                              );
                            })}
                            {user.badges.length > 3 && (
                              <motion.div
                                whileHover={{ scale: 1.2, y: -5 }}
                                className="bg-gray-100 text-gray-500 p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ring-1 ring-white"
                              >
                                +{user.badges.length - 3}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-6 pb-6">
            {/* My Achievement Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{
                boxShadow: "0 0 20px rgba(109, 40, 217, 0.15)",
              }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-design-greyOutlines"
            >
              <div className="absolute inset-0 bg-gradient-secondary opacity-5" />
              <div className="p-4 border-b border-design-greyOutlines bg-design-greyBG/30 relative z-10">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-button-primary-cta" />
                  <h3 className="text-lg font-semibold text-design-black">
                    My Achievement
                  </h3>
                </div>
              </div>
              <div className="p-4 relative z-10">
                <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-button-primary-cta w-8 text-center">
                      {myPosition}
                    </span>
                    <img
                      src={myUser?.avatar}
                      alt="My Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                    />
                    <div>
                      <p className="font-semibold text-design-black">
                        {myUser?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {myUser?.points.toLocaleString()} Points
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="px-4 pb-4 relative z-10">
                <p className="text-sm text-gray-600">
                  You're doing great! Keep up the excellent work and climb
                  higher on the leaderboard.
                </p>
              </div>
            </motion.div>

            {/* Achievements Section */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-md relative overflow-hidden border border-design-greyOutlines"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <BadgeCheck className="w-5 h-5 text-button-primary-cta" />
                <h3 className="text-lg font-semibold text-design-black">
                  Your Achievements
                </h3>
              </div>

              <div className="space-y-3">
                {ACHIEVEMENTS.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center p-3 bg-design-greyBG/30 rounded-lg hover:bg-button-tertiary-fill transition-colors"
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${achievement.color}`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <achievement.icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-design-black">
                        {achievement.label}
                      </h4>
                      <p className="text-xs text-design-primaryGrey">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="ml-2">
                      <Shield className="w-5 h-5 text-semantic-success" />
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="mt-4 p-3 border border-dashed border-button-primary-cta/30 rounded-lg bg-button-tertiary-fill/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-button-primary-cta" />
                    <div>
                      <h4 className="font-medium text-design-black">
                        Next Reward
                      </h4>
                      <p className="text-xs text-design-primaryGrey">
                        Reach Level {myLevel + 1} to unlock
                      </p>
                    </div>
                  </div>
                  <Rocket className="w-5 h-5 text-button-primary-cta" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add custom styles for date picker */}
      <style jsx="true" global="true">{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
        }

        .react-datepicker {
          border: none !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
          border-radius: 12px !important;
          font-family: inherit !important;
        }

        .react-datepicker__header {
          background-color: white !important;
          border-bottom: 1px solid #f0f0f0 !important;
          padding-top: 12px !important;
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--in-range {
          background-color: #6d28d9 !important;
          color: white !important;
        }

        .react-datepicker__day--in-selecting-range {
          background-color: rgba(109, 40, 217, 0.2) !important;
        }

        .react-datepicker__day:hover {
          background-color: #f0eeff !important;
        }
      `}</style>
    </motion.div>
  );
}
