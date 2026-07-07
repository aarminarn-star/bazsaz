import { useState } from 'react'

export const useAppState = () => {
  const [state, setState] = useState({
    uploadedPhoto: null,
    selectedDoorId: null,
    selectedHandleId: null,
    phoneNumber: '',
    currentStep: 'photo', // photo | tryOn | catalog | lead
  })

  const setUploadedPhoto = (photo) => {
    setState(prev => ({ ...prev, uploadedPhoto: photo }))
  }

  const setSelectedDoorId = (id) => {
    setState(prev => ({ ...prev, selectedDoorId: id }))
  }

  const setSelectedHandleId = (id) => {
    setState(prev => ({ ...prev, selectedHandleId: id }))
  }

  const setPhoneNumber = (phone) => {
    setState(prev => ({ ...prev, phoneNumber: phone }))
  }

  const setCurrentStep = (step) => {
    setState(prev => ({ ...prev, currentStep: step }))
  }

  return {
    state,
    setUploadedPhoto,
    setSelectedDoorId,
    setSelectedHandleId,
    setPhoneNumber,
    setCurrentStep,
  }
}
