import { useState } from 'react';
import JobDetails from './JobDetails';

export default function JobListing({jobSearch}) {

    const [jDesc, setjDesc]=useState([])
    const [keywords, setKeywords] = useState([]);
    const getKeywords = async(text) => {
        const url = "https://api.openai.com/v1/chat/completions";
        const options = {
            method: 'POST',
            headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_LKey}`, 
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",           
            prompt:
              'Extract keywords from this text. Make the first letter of every word uppercase and separate with commas:\n\n' +
              text +
              '',
            temperature: 0.5,
            max_tokens: 60,
            top_p: 1.0,
            frequency_penalty: 0.8,
            presence_penalty: 0.0,
          }),
        };
        try {
          const response = await fetch(
            url,
            options
          );
          const json = await response.json();
          console.log(json.choices[0].text.trim());
          setKeywords(json.choices[0].text.trim());
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
    }

return ( 
    <>
    <div className='container inline-block mb-2 w-2/6 pl-10'>
    <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
        {jobSearch.map((job, index) =>{
        return(
            <a href="#description" onClick={(e) => {
                setjDesc(job);
                getKeywords(job.job_description);
            }}>
            <li className="pb-3 sm:pb-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src={job.employer_logo}/>
                </div>
                <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                {job.job_title}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                {job.employer_name}
                </p>
            </div>
            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-black">
             {job.job_city} {job.job_country}
            </div>
            </div>
        </li>
        </a>
        )
        })}
   </ul>
   </div>
   <JobDetails job={jDesc}/>
   </>
)
}