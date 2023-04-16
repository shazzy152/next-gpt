import { useEffect } from 'react'
import styles from '@/styles/Home.module.css'
import { Form, Button, Spinner } from 'react-bootstrap'
import { FormEvent, useState } from 'react'
import axios from 'axios'

const HomePage = () => {

  const [quote, setQuote] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteLoadingError, setQuoteLoadingError] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [errStatus, setErrStatus] = useState<number>();
  const [user, setUser] = useState({
    name: "",
    occupation:""
  })
  const [count, setCount] = useState(0);

  let api_key;

  if (typeof window !== 'undefined') {
    api_key = localStorage.getItem("API_KEY")
  } 

  const [key, setKey] = useState<string | null>(api_key ? api_key : null);
  const [init, setInit] = useState(false);

  async function keyStore() {
    setInit(true)
    if (typeof window !== 'undefined') {
      // @ts-ignore
     localStorage.setItem("API_KEY", key)
    }   

    try {
      const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:6NNm23Cg/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      const data = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt")?.toString().trim();

    if (prompt) {
      try {
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch(`/api/gptapi?prompt=${prompt}&key=${key?.toString()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        setErrStatus(response.status)
        const body = await response.json();
        setQuote(body.quote);
      } catch (error) {
        console.error(error);
        setQuoteLoadingError(true);
      } finally {
        setQuoteLoading(false);
        return false;
      }
    }
  }

  async function handleText(text: string) {
    if (text) {
      try {
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);
        const prompt = text?.toString().trim();
        const response = await fetch(`/api/gptapi?prompt=${prompt}&key=${key?.toString()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        const body = await response.json();
        setQuote(body.quote);
      } catch (error) {
        console.error(error);
        setQuoteLoadingError(true);
      } finally {
        setQuoteLoading(false);
        return false;
      }
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  let regex = /^[^\S\n]*\d+\..*(?:\n(?![^\S\n]*\d+\.).*)*/gm;
  let matches = quote.match(regex);
  
  const copy = (text:string) => {
    navigator.clipboard.writeText(text);
    alert('Text copied')
  }

  useEffect(() => {
      setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  return (
    <div className="w-100 h-auto d-flex flex-column justify-content-start align-items-center mt-5 pt-5">
        <div className="w-75">
          <h1 className="display-1 mb-4">Re-Prompt</h1>
          <h3>Prompt Generator powered by GPT-3</h3>
          {(init || api_key !== null) ? (<div className="my-5">Enter a topic/prompt and generate prompt variations.</div>)
          : (<div className="my-5">Please enter your details to continue.</div>)}
        </div>
          <div className="d-flex justify-content-center w-100">
            <Form onSubmit={handleSubmit} className={`${styles.inputForm} d-flex flex-column justify-content-center align-items-center`}>
              <Form.Group className='mb-3 w-100' controlId='prompt-input'>
                {(api_key === null) && 
                (<div>
                  <div className="d-flex justify-content-between w-100 align-items-center p-3">
                    <Form.Label className="text-nowrap">Name</Form.Label>
                    <Form.Control
                      className="w-75 ms-3"
                      name='name'
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div className="d-flex justify-content-between w-100 align-items-center p-3">
                    <Form.Label className="text-nowrap">What do you do?</Form.Label>
                    <Form.Control
                      className="w-75 ms-3"
                      name='occupation'
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div className="d-flex justify-content-between w-100 align-items-center p-3">
                    <Form.Label className="text-nowrap"><a target="_blank" href='https://platform.openai.com/account/api-keys'>Open AI API key</a> :</Form.Label>
                    <Form.Control
                      className="w-75 ms-3"
                      name='api_key'
                      onChange={(e) => setKey(e.target.value)}
                      placeholder="Click on label to generate new key"
                    />
                  </div>
                  <Button disabled={user.name && user.occupation && key ? false : true} onClick={() => keyStore()} className='my-3 w-25'>
                    Submit
                  </Button>  
                </div>)}
                {(init || api_key !== null) && 
                (<Form.Control
                  as="textarea" 
                  rows={4}
                  name='prompt'
                  maxLength={250}
                  placeholder='e.g. Email marketing, Fourier transform, linear regression model...'
                  onChange={e => setCount(e.target.value.length)}
                />)}
              </Form.Group>
              <span>{count > 249 ? "Exceeded character limit. kindly keep the prompt within 250 characters" : ""}</span>
              {(init || api_key !== null) && (<div className="d-flex flex-column justify-content-center align-items-center">
                <Button type='submit' className='my-3 w-100' disabled={quoteLoading}>
                  Submit
                </Button>  
                <Button onClick={() => {localStorage.clear(); window.location.reload()}} type='submit' className='my-2 w-100' disabled={quoteLoading}>
                  Use another key
                </Button>           
              </div>)}
            </Form>
          </div>
        {quoteLoading && <Spinner animation='border' />}
        {(errStatus === 500) ? <span>Looks like Your OpenAI API Free Trial has expired. You can check your status <a target="_blank" href='https://platform.openai.com/account/usage'>here</a></span> : quoteLoadingError ? "Server took too long to respond. Please try again." : ""}
        {matches && 
          <div className={`${styles.quotecard} p-2`}>
            {matches.map((match, index) => {
              let text = match.replace(/^\d+\.\s*/, '')
              return (
              <div className={`${styles.card} m-2 border d-flex justify-content-center align-items-center rounded px-4 pb-4 position-relative`} key={index}>
                <span className="fs-6 my-4">{text}</span>
                <div className="position-absolute end-0 bottom-0 p-1 d-flex mb-1">
                  <Button className={`${styles.action_btn} mx-1`} onClick={() => handleText(text)}>
                    Refine
                  </Button> 
                  <Button className={`${styles.action_btn} mx-2`} onClick={() => copy(text)}>
                    Copy
                  </Button> 
                </div>
              </div>
            )})}
          </div>
        }
    </div>
  )
}

export default HomePage