import { Label, TextInput, Button, Modal, Tabs, Dropdown, Spinner } from "flowbite-react";
import { useState, useRef, useEffect, Fragment, FC } from "react";
import { Menu, Transition } from "@headlessui/react";
import { AiOutlineDown } from 'react-icons/ai'
import Surovina from "./tabItems/Surovina";
import VtoroNivo from "./tabItems/VtoroNivo";
import TretoNivo from "./tabItems/TretoNivo";
import Kontragent from "./tabItems/Kontragent";
import Supplier from "./tabItems/Supplier";
import Product from "./tabItems/Product";
import * as funcs from './tabItems/handleFunctions';
import React from "react";
import { ItemProps } from "./tabItems/ItemProps";

 
interface SuroviniProps {
  isOpen: ItemProps['isOpen'];
  setOpen: ItemProps['setOpen'];
  toasty: ItemProps['toasty'];
  setToasty: ItemProps['setToasty'];
  // setToasty: React.Dispatch<React.SetStateAction<{
  //   vis: boolean; text: string | any; status: string;}>>;
}

// interface Data2State : {
//   data2: ItemProps["data2"];
// }


const Surovini = ( props: SuroviniProps ) : JSX.Element => {
  const { isOpen, setOpen, toasty, setToasty } = props;
  

    const [isProcessing, setProcessing] = useState<boolean>(false);
    const [data2, setData2] = useState<ItemProps['data2']>({
      surovini: { text: '' },
      vtoro:{ text: '', name: '', id: ''},
      treto: { text: '', name: '', id: '' },
      kontragent: {text: ''},
      supplier : { name: '', country: '', city: '', address : '', website: '', email: '', employees: '', another: '', address_workshop: '', kontragent: '', phone: '', id: ''},
      product: { treto: { name: '', id: '' }, name: '', measure: '', density: '', size: '', weight: '', description: '', another: '', supplier: { name: '', id: '' }, code: '', package: '', cost: '', }
    });
    const [val, setVal] = useState<number>(0);
    const [wrong, setWrong] = useState<ItemProps['wrong']>({
      surovini: { is: false, txt: '',},
      vtoro: { is: false, txt: '',},
      treto: { is: false, txt: '',},
      kontragent: { is: false, txt: '',},
      supplier: { is: false, txt: '', },
      product: { is: false, txt: '', },
    });
    const [results, setResults] = useState<ItemProps['results']>({
      surovini: null,
      vtoro: null,
      treto: null,
      kontragent: null,
      supplier: null,
      product: null,
    })
    const [chosen, setChosen] = useState<ItemProps['chosen']>({
      surovini: {name: null, id: null},
      vtoro: null,
      treto: null,
      kontragent: null,
      supplier: null,
      product: null,
    });

    useEffect( () => {
      const get =  async () => {
        await funcs.fetchData(setResults, chosen);
      }
      get();
      if (isOpen === true) {
        get();
      }
    },[isOpen === true])


    useEffect( () => {
      console.log(`val:`, val);
    },[val]);

    const handleSubmitVtoroNivo = async (e: any) => {
      e.preventDefault();
      const props : any = {
        wrong: wrong,
        val: val,
        data2: data2,
        setWrong: setWrong,
        setProcessing: setProcessing,
        setOpen: setOpen,
        setData2: setData2,
      }
      await funcs.handleSubmitVtoroNivo(props);
      await funcs.fetchData(setResults, chosen);
      console.log(`results, chosen:`, results, chosen);
    }
  // !isOpen && null && setWrong({first: false, second: false, third: false});
  // if (!isOpen) {
  //   setWrong((prevWrong : any) => {
  //     return {
  //       ...prevWrong,
  //       surovini: { is: false, txt: '' },
  //       vtoro: { is: false, txt: '' },
  //       treto: { is: false, txt: '' },
  //       kontragent: { is: false, txt: '' },
  //       supplier: { is: false, txt: '' },
  //       product: { is: false, txt: '' },
  //     }
  //   })
  //   setResults({ ...results, surovini: null, vtoro: null, treto: null, kontragent: null, supplier: null, product: null });
  //   return null;
  // }

  
  return (
    <>
        <dialog id="modal_1" className={`modal-box w-11/12 max-w-6xl min-h-[300px]`} >
          <div>
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => (window as any).modal_1.close() && setOpen(false) }>X</button>
            <div className="tabs mb-5">
              <a className={`tab tab-lifted font-bold text-lg ${ val === 0 && `tab-active` } `} onClick={() => setVal(0)} >Суровини ({results.surovini && results.surovini.length})</a>
              {/* <a className={`tab tab-lifted font-bold text-lg ${ val === 1 && `tab-active` } `} onClick={() => setVal(1)} >Второ ниво ({results.vtoro && results.vtoro.length})</a> */}
              {/* <a className={`tab tab-lifted font-bold text-lg ${ val === 2 && `tab-active` } `} onClick={() => setVal(2)} >Трето ниво ({results.treto && results.treto.length})</a> */}
              <a className={`tab tab-lifted font-bold text-lg ${ val === 3 && `tab-active` } `} onClick={() => setVal(3)} >Контрагенти ({results.kontragent && results.kontragent.length})</a>
              {/* <a className={`tab tab-lifted font-bold text-lg ${ val === 4 && `tab-active` } `} onClick={() => setVal(4)} >Доставчици ({results.supplier && results.supplier.length})</a> */}
              {/* <a className={`tab tab-lifted font-bold text-lg ${ val === 5 && `tab-active` } `} onClick={() => setVal(5)} >Продукти ({results.product && results.product.length})</a> */}
            </div>
            { val === 0 ? <Surovina handleSubmitVtoroNivo={handleSubmitVtoroNivo} wrong={wrong} isProcessing={isProcessing} setData2={setData2} isOpen={isOpen} setOpen={setOpen} val={val} data2={data2} results={results} setProcessing={setProcessing} setToasty={setToasty} setVal={setVal} setResults={setResults} chosen={chosen} setChosen={setChosen} setWrong={setWrong} /> :

            val === 1 ? <VtoroNivo handleSubmitVtoroNivo={handleSubmitVtoroNivo} isProcessing={isProcessing} setData2={setData2} wrong={wrong} val={val} isOpen={isOpen} setOpen={setOpen} setWrong={setWrong} data2={data2} results={results} setProcessing={setProcessing} setToasty={setToasty} setVal={setVal} setResults={setResults} setChosen={setChosen} chosen={chosen}  /> :
            // val === 1 ?
            //   <VtoroNivo handleSubmitVtoroNivo={handleSubmitVtoroNivo} isProcessing={isProcessing} setData2={setData2} wrong={wrong} val={val}  data2={data2} results={results} setProcessing={setProcessing} setToasty={setToasty} setVal={setVal} setResults={setResults} setChosen={setChosen} chosen={chosen} /> :
            val === 2 ? <TretoNivo handleSubmitVtoroNivo={handleSubmitVtoroNivo} isProcessing={isProcessing} setData2={setData2} wrong={wrong} val={val} isOpen={isOpen} setOpen={setOpen} setWrong={setWrong} data2={data2} results={results} setProcessing={setProcessing} setToasty={setToasty} setVal={setVal} setResults={setResults} setChosen={setChosen} chosen={chosen}  /> :
            
            val === 3 ? <Kontragent handleSubmitVtoroNivo={handleSubmitVtoroNivo} wrong={wrong} isProcessing={isProcessing} setData2={setData2} isOpen={isOpen} setOpen={setOpen} val={val} data2={data2} results={results} setProcessing={setProcessing} setToasty={setToasty} setVal={setVal} setResults={setResults} chosen={chosen} setChosen={setChosen} setWrong={setWrong} /> :
              // <Kontragent handleSubmitVtoroNivo={handleSubmitVtoroNivo} isOpen={isOpen} setOpen={setOpen} isProcessing={isProcessing} setData2={setData2} wrong={wrong} val={val} /> :
            val === 4 ? <Supplier handleSubmitVtoroNivo={handleSubmitVtoroNivo} wrong={wrong} isProcessing={isProcessing} setData2={setData2} isOpen={isOpen} setOpen={setOpen} val={val} data2={data2} results={results} setProcessing={setProcessing} setToasty={setToasty} setVal={setVal} setResults={setResults} chosen={chosen} setChosen={setChosen} setWrong={setWrong} /> :
            // val === 5 ?

            val === 5 ? <Product handleSubmitVtoroNivo={handleSubmitVtoroNivo} isProcessing={isProcessing} setData2={setData2} wrong={wrong} val={val} isOpen={isOpen} setOpen={setOpen} setWrong={setWrong} data2={data2} results={results} setProcessing={setProcessing} setToasty={setToasty} setVal={setVal} setResults={setResults} setChosen={setChosen} chosen={chosen}  /> : null
            
            //   <Product handleSubmitVtoroNivo={handleSubmitVtoroNivo} isOpen={isOpen} setOpen={setOpen} data2={data2} setData2={setData2} isProcessing={isProcessing} wrong={wrong} results={results}  /> : null  }
          }
        </div>
        </dialog>
    </>
  );
};

export default Surovini;