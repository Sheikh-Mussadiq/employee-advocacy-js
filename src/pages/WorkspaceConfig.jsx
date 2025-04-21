import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createWorkspace, uploadWorkspaceImage, updateWorkspace } from '../services/workspaceServices';
import { FiUpload, FiEdit3, FiBriefcase, FiInfo, FiCheck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CustomToaster from '../components/ui/CustomToaster';
import {useAuth} from '../context/AuthContext';

function WorkspaceConfig() {
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const {currentUser, authUser, setWorkSpaceNotCreated, workSpace, setWorkSpace} = useAuth();
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: 'Please upload a valid image file (JPEG, PNG, GIF, WEBP)'
      }));
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        image: 'Image size should be less than 2MB'
      }));
      return;
    }

    setImageFile(file);
    setErrors(prev => ({ ...prev, image: null }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!workspaceName.trim()) {
      newErrors.name = 'Workspace name is required';
    } else if (workspaceName.length < 3) {
      newErrors.name = 'Workspace name must be at least 3 characters';
    }
    
    if (!workspaceDescription.trim()) {
      newErrors.description = 'Workspace description is required';
    } else if (workspaceDescription.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!imageFile) {
      newErrors.image = 'Workspace image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Upload the image using the user ID
      const { error: uploadError, url } = await uploadWorkspaceImage(imageFile, currentUser.accountId);
      
      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      // 2. Create the workspace with the image URL
      const { error: workspaceError, workspace } = await createWorkspace({
        name: workspaceName,
        description: workspaceDescription,
        account_id: currentUser.accountId,
        created_by: authUser.id,
       img_path: url // Include the logo URL directly
      });
      
      if (workspaceError) throw new Error(`Workspace creation failed: ${workspaceError.message}`);
      
      toast.success('Workspace created successfully!');
      setWorkSpace(workspace);
      setWorkSpaceNotCreated(false);
      navigate('/settings'); // Redirect to dashboard or appropriate page
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error('Failed to create workspace: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-design-greyBG min-h-screen flex items-center justify-center p-4">
      <CustomToaster />
      <motion.div 
        className="max-w-xl w-full space-y-8 bg-design-white p-8 rounded-xl shadow-lg relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background gradient */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-glow opacity-30 blur-xl"></div>
        
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-2xl font-bold text-design-black">Create Your Workspace</h1>
          <p className="text-design-primaryGrey mt-2">Configure your organization's workspace</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col items-center justify-center">
              <div 
                className="relative w-32 h-32 rounded-full overflow-hidden mb-4 group"
                style={{ 
                  backgroundColor: imagePreview ? 'transparent' : '#F0EEFF',
                  border: '2px dashed #6D28D9'
                }}
              >
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Workspace logo preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FiBriefcase className="text-4xl text-button-primary-cta opacity-70" />
                  </div>
                )}
                
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <FiEdit3 className="text-white text-2xl" />
                </div>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              
              <button 
                type="button" 
                onClick={handleUploadClick}
                className="btn-secondary flex items-center space-x-2 text-sm mb-1"
              >
                <FiUpload />
                <span>{imageFile ? 'Change Image' : 'Upload Logo'}</span>
              </button>
              
              {errors.image && (
                <p className="text-semantic-error text-xs mt-1 flex items-center">
                  <FiX className="mr-1" />
                  {errors.image}
                </p>
              )}
              
              <p className="text-xs text-design-primaryGrey mt-1">
                Recommended: Square image, at least 512x512px
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <label htmlFor="workspaceName" className="label flex items-center">
              <FiBriefcase className="mr-2" />
              Workspace Name
            </label>
            <div className="relative">
              <input 
                id="workspaceName"
                type="text" 
                value={workspaceName}
                onChange={(e) => {
                  setWorkspaceName(e.target.value);
                  if (errors.name) setErrors({...errors, name: null});
                }}
                className={`input ${errors.name ? 'border-semantic-error' : ''}`}
                placeholder="e.g. Acme Corporation"
              />
              {workspaceName && !errors.name && (
                <FiCheck className="absolute right-3 top-3 text-semantic-success" />
              )}
            </div>
            {errors.name && (
              <p className="text-semantic-error text-xs mt-1 flex items-center">
                <FiX className="mr-1" />
                {errors.name}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <label htmlFor="workspaceDescription" className="label flex items-center">
              <FiInfo className="mr-2" />
              Workspace Description
            </label>
            <div className="relative">
              <textarea 
                id="workspaceDescription"
                value={workspaceDescription}
                onChange={(e) => {
                  setWorkspaceDescription(e.target.value);
                  if (errors.description) setErrors({...errors, description: null});
                }}
                className={`input min-h-[100px] resize-none ${errors.description ? 'border-semantic-error' : ''}`}
                placeholder="Describe your organization and its mission..."
              />
              {workspaceDescription && !errors.description && (
                <FiCheck className="absolute right-3 top-3 text-semantic-success" />
              )}
            </div>
            {errors.description && (
              <p className="text-semantic-error text-xs mt-1 flex items-center">
                <FiX className="mr-1" />
                {errors.description}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <button 
              type="submit" 
              className="btn-primary w-full py-3 relative overflow-hidden group"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Workspace...
                </span>
              ) : (
                <span>Create Workspace</span>
              )}
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default WorkspaceConfig;
