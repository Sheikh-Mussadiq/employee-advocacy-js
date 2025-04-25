"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Copy, RefreshCw, Shield, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { updateWorkspace } from "../../services/workspaceServices"

export default function AccessTokenGenerator() {
  const { workSpace, setWorkSpace } = useAuth()
  const [accessToken, setAccessToken] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [isTokenVisible, setIsTokenVisible] = useState(false)
  
  // Initialize with existing access code if available
  useEffect(() => {
    if (workSpace?.access_code) {
      setAccessToken(workSpace.access_code)
      setShowToken(true)
      setIsTokenVisible(false) // Default to hidden for security
    }
  }, [workSpace])

  // Function to generate a random access token and update it in the database
  const generateAccessToken = async () => {
    if (!workSpace?.id) {
      toast.error("Workspace not found")
      return
    }
    
    setIsGenerating(true)
    setShowToken(true)
    
    try {
      // Generate a random string of characters (letters, numbers, and special chars)
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$%&'
      const tokenLength = 32
      let token = ''
      
      for (let i = 0; i < tokenLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        token += characters.charAt(randomIndex)
      }
      
      // Update the workspace with the new access code
      const { error, workspace } = await updateWorkspace(workSpace.id, { access_code: token })
      
      if (error) {
        console.error("Error updating workspace access code:", error)
        toast.error("Failed to update workspace access code")
        setIsGenerating(false)
        return
      }
      
      // Update local state
      setAccessToken(token)
      setWorkSpace(workspace) // Update the workspace in context
      setIsGenerating(false)
      toast.success("New workspace access token generated and saved")
    } catch (err) {
      console.error("Exception generating access token:", err)
      toast.error("An error occurred while generating the token")
      setIsGenerating(false)
    }
  }

  // Function to copy token to clipboard
  const copyToClipboard = () => {
    if (!accessToken) {
      toast.error("Generate a token first")
      return
    }
    
    navigator.clipboard.writeText(accessToken)
      .then(() => toast.success("Token copied to clipboard"))
      .catch(() => toast.error("Failed to copy token"))
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-primaryPurple/20 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="p-2 bg-primaryPurple/10 rounded-lg"
          >
            <Shield className="w-5 h-5 text-primaryPurple" />
          </motion.div>
          <div>
            <h3 className="text-base font-medium text-design-black">Workspace Access Token</h3>
            <p className="text-xs text-design-primaryGrey">Generate a secure token for workspace access</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateAccessToken}
          disabled={isGenerating}
          className={`btn-primary flex items-center gap-2 px-5 py-2 font-medium shadow-md ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : accessToken ? 'Regenerate Token' : 'Generate Token'}
        </motion.button>
      </div>
      
      {/* Token display area - only shown after generation */}
      {showToken && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <input
                type={isTokenVisible ? "text" : "password"}
                value={accessToken}
                readOnly
                placeholder={isGenerating ? "Generating token..." : "No token generated yet"}
                className="w-full px-3 py-2 text-sm border border-design-greyOutlines bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryPurple pr-20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {accessToken && (
                  <>
                    <button 
                      onClick={() => setIsTokenVisible(!isTokenVisible)}
                      className="text-design-primaryGrey hover:text-design-black"
                      title={isTokenVisible ? "Hide token" : "Show token"}
                    >
                      {isTokenVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={copyToClipboard}
                      className="text-design-primaryGrey hover:text-design-black"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {accessToken && (
            <div className="text-xs text-semantic-warning flex items-center gap-1 mt-2 bg-amber-50 p-2 rounded border border-amber-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              <span>Keep this token secure. It enables your employees to access workspace data—including the name, image, and description—when joining the workspace.</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
