import { useState } from 'react'
import { useAppState } from './hooks/useAppState'
import PhotoUpload from './components/PhotoUpload'
import TryOnViewport from './components/TryOnViewport'
import CatalogBottomSheet from './components/CatalogBottomSheet'
import LeadCapture from './components/LeadCapture'

function App() {
  const { state, setUploadedPhoto, setSelectedDoorId, setSelectedHandleId, setPhoneNumber, setCurrentStep } = useAppState()

  const handlePhotoUpload = (photoUrl) => {
    setUploadedPhoto(photoUrl)
    setCurrentStep('tryOn')
  }

  const handleShowResult = () => {
    setCurrentStep('catalog')
  }

  const handleLeadCapture = () => {
    setCurrentStep('lead')
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full" dir="rtl">
      {/* Step 1: Photo Upload */}
      {state.currentStep === 'photo' && (
        <PhotoUpload onPhotoUpload={handlePhotoUpload} />
      )}

      {/* Step 2: Try-On Viewport */}
      {state.currentStep === 'tryOn' && (
        <div className="flex flex-col h-screen">
          <TryOnViewport
            backgroundPhoto={state.uploadedPhoto}
            selectedDoorId={state.selectedDoorId}
            onShowResult={handleShowResult}
            onEditPhoto={() => setCurrentStep('photo')}
          />
          <CatalogBottomSheet
            selectedDoorId={state.selectedDoorId}
            selectedHandleId={state.selectedHandleId}
            onSelectDoor={setSelectedDoorId}
            onSelectHandle={setSelectedHandleId}
            onProceed={handleLeadCapture}
          />
        </div>
      )}

      {/* Step 3: Catalog Selection */}
      {state.currentStep === 'catalog' && (
        <div className="flex flex-col h-screen">
          <TryOnViewport
            backgroundPhoto={state.uploadedPhoto}
            selectedDoorId={state.selectedDoorId}
            onShowResult={handleShowResult}
            onEditPhoto={() => setCurrentStep('photo')}
          />
          <CatalogBottomSheet
            selectedDoorId={state.selectedDoorId}
            selectedHandleId={state.selectedHandleId}
            onSelectDoor={setSelectedDoorId}
            onSelectHandle={setSelectedHandleId}
            onProceed={handleLeadCapture}
          />
        </div>
      )}

      {/* Step 4: Lead Capture */}
      {state.currentStep === 'lead' && (
        <LeadCapture
          phoneNumber={state.phoneNumber}
          selectedDoorId={state.selectedDoorId}
          selectedHandleId={state.selectedHandleId}
          onPhoneChange={setPhoneNumber}
          onBack={() => setCurrentStep('catalog')}
        />
      )}
    </div>
  )
}

export default App
