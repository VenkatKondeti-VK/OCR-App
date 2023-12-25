import { useState, useEffect } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from './firebase'

function App() {
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(null)
  const [fileUrl, setFileUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [ocrData, setOcrData] = useState({})
  const [ocrCards, setOcrCards] = useState([])
  const [deleteCardError, setDeleteCardError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [cardsError, setCardsError] = useState(null)
  const [noCardsError, setNoCardsError] = useState(false)
  const [cardCreate, setCardCreate] = useState(false)
  const [noSubmit, setNoSubmit] = useState(false)


  // FILE UPLOAD WHEN FILE CHANGEs
  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])

  // Cards Error
  useEffect(() => {
    if(ocrCards && ocrCards.length > 0){
      setNoCardsError(false)
    }
  }, [ocrCards])


  // HANDLE FILE UPLOAD ON FIREBASE
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
      },
      (err) => {
        setFileUploadError(err)
        setNoSubmit(true)
      },
      // callback function for getting file URL
      () => {
        // retrieving the file's URL from cloud storage
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setFileUrl(downloadURL)
            setFileUploadError(false)
            setNoSubmit(false)
          })
      }
    )
  }


  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    setLoading(true)
    setCardCreate(false)
    e.preventDefault()

    const res = await fetch('/api/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url: fileUrl}),
    })
    const data = await res.json()
    console.log(data)
    setLoading(false)
    setOcrData(data)
    setCardCreate(true)
  }


  // Handle Show Cards
  const handleShowCards = async () => {
    try{
      setCardsError(null)
      const res = await fetch('/api/ocrs')
      const data = await res.json()

      if(data.success === false){
        setCardsError(data.message)
        return
      }
      
      setOcrCards(data)
      if(ocrCards.length === 0){
        setNoCardsError(true)
      }
    }
    catch(err){
      setCardsError(err.message)
    }
  }


  // Handle Delete Card
  const handleDeleteCard = async (id) => {
    try{
      setDeleteCardError(null)
      setDeleteLoading(true)
      const res = await fetch(`/api/ocr/delete/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if(data.success === false){
        setDeleteCardError(data.message)
        setDeleteLoading(false)
        return
      }

      // Updating the Cards after successful deletion from database
      setOcrCards((prev) => prev.filter((ocrCard) => {return ocrCard._id != id}))
      setDeleteLoading(false)
    }
    catch(err){
      setDeleteCardError(err.message)
      setDeleteLoading(false)
    }
  }
  



  return (

    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl font-semibold text-center my-7'>OCR APP</h1>
      
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* IMAGE */}
        {(fileUrl !== "") ? <img src={fileUrl} alt='ID' className='h-200 w-200 object-cover cursor-pointer self-center mt-2'></img> : <></>}

        {/* IMAGE INPUT */}
        <input onChange={(e) => {setFile(e.target.files[0])}} type='file' name="image" accept='.png, .jpeg, .jpg'></input>
        <button disabled={noSubmit} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover-opacity:75'>{loading ? "Processing" : "Submit"}</button>

        {/* UPLOAD PROGRESS */}
        <p className='text-sm self-center'>
          { (fileUploadError) ? 
            <span className='text-red-700'>Max Size Limit! - 2MB</span> :

            (filePerc > 0 && filePerc < 100) ? 
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span> :

            (filePerc === 100) ?
            <span className='text-green-700'>Successfully Uploaded!</span> : 
            ""
          }
        </p>
      </form>

      {ocrData.name && (
        <div className='mt-10 mb-5 flex flex-col items-center gap-2 border p-3 rounded-lg'>
          <h1 className='text-2xl font-semibold'>OCR RESULT</h1>
          <div>
            <p>Identification Number: {ocrData.id}</p>
            <p>Name: {ocrData.name}</p>
            <p>Last Name: {ocrData.lastName}</p>
            <p>Date of Birth: {ocrData.dob}</p>
            <p>Date of Issue: {ocrData.issue}</p>
            <p>Date of Expiry: {ocrData.expiry}</p>
          </div>
        </div>
      )}

      <div className='flex flex-col'>
        <p className='self-center'>
          {
            (cardCreate) ?
              <span className='text-green-700'>Record of the Card created successfully</span> : 
            "" 
          } 
        </p>
      </div>
      

      <div className='flex justify-center'>
        <span onClick={handleShowCards} className='text-blue-700 cursor-pointer mt-5'>Show Cards</span>
      </div>

      <p className='text-red-700 mt-4'>{cardsError ? cardsError : ""}</p>

      {noCardsError && 
        <div className='flex justify-center'>
          <p className='text-red-700 mt-5'>There are no OCR cards to display!</p>
        </div>
      }

      {ocrCards && ocrCards.length > 0 && 
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>OCR Cards</h1>
          {ocrCards.map((ocrCard) => {
            return(
              <div key={ocrCard._id} className='flex justify-between items-center border rounded-lg p-3 gap-4'>
  
                <img src={ocrCard.image} alt="OCR Card" className='h-20 w-20'></img>
                <p className='text-slate-700 font-semibold flex-1 truncate'>{ocrCard.name}</p>
                <div className='flex flex-col items-center'>
                  <button onClick={() => handleDeleteCard(ocrCard._id)} className='text-red-700'>{deleteLoading ? "DELETING..." : "DELETE"}</button>
                </div>

              </div>
            )
          })}
          {deleteCardError && <p className='text-red-500 text-sm'>{deleteCardError}</p>}
        </div>
      }
      
      
    </div>

  )
}

export default App
