import { useEffect } from 'react'
import styles from '@/styles/Home.module.css'
import { Form, Button, Spinner } from 'react-bootstrap'
import { FormEvent, useState } from 'react'

const HomePage = () => {

  const [quote, setQuote] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteLoadingError, setQuoteLoadingError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt")?.toString().trim();

    console.log(prompt)

    if (prompt) {
      try {
        setQuote("");
        setQuoteLoadingError(false);
        setQuoteLoading(true);

        const response = await fetch("/api/gptapi?prompt=" + prompt);
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

        const response = await fetch("/api/gptapi?prompt=" + text);
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

  let regex = /^[^\S\n]*\d+\..*(?:\n(?![^\S\n]*\d+\.).*)*/gm;
  let matches = quote.match(regex);
  
  const copy = (text:string) => {
    navigator.clipboard.writeText(text);
    alert('Text copied')
  }

  return (
    <div className="h-100 w-100 d-flex flex-column justify-content-start align-items-center position-relative mt-5 pt-5">
        <div className="w-75">
          <h1>Chat GPT Prompt Generator</h1>
          <h2>powered by GPT-3</h2>
          <div className="my-5">Enter a topic/prompt and generate prompt variations.</div>
        </div>
          <Form onSubmit={handleSubmit} className={`${styles.inputForm}`}>
            <Form.Group className='mb-3' controlId='prompt-input'>
              <Form.Control
                name='prompt'
                placeholder='e.g. Email marketing, Fourier transform, linear regression model...'
              />
            </Form.Group>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <Button type='submit' className='my-3 w-25' disabled={quoteLoading}>
                Submit
              </Button>            
            </div>
          </Form>
        {quoteLoading && <Spinner animation='border' />}
        {quoteLoadingError && "Something went wrong. Please try again."}
        {matches && 
          <div className={`${styles.quotecard} p-2`}>
            {matches.map((match, index) => {
              let text = match.replace(/^\d+\.\s*/, '')
              return (
              <div className={`${styles.card} m-2 border d-flex justify-content-center align-items-center rounded p-4 position-relative`} key={index}>
                <span className="fs-6 my-2">{text}</span>
                <div className="position-absolute end-0 bottom-0 p-1 d-flex">
                  <i className="bi-arrow-clockwise mx-2" role="button" onClick={() => handleText(text)}></i>
                  <i className="bi-clipboard" role="button" onClick={() => copy(text)}></i>
                </div>
              </div>
            )})}
          </div>
        }
    </div>
  )
}

export default HomePage