export interface ItemProps {
  handleSubmitVtoroNivo: (e: any) => Promise<any>;
  wrong: {
    surovini: { is: boolean; txt: string };
    vtoro: { is: boolean; txt: string };
    treto: { is: boolean; txt: string };
    kontragent: { is: boolean; txt: string };
    supplier: { is: boolean; txt: string };
    product: { is: boolean; txt: string };
  };
  setWrong: React.Dispatch<React.SetStateAction<{
    surovini: { is: boolean; txt: string };
    vtoro: { is: boolean; txt: string };
    treto: { is: boolean; txt: string };
    kontragent: { is: boolean; txt: string };
    supplier: { is: boolean; txt: string };
    product: { is: boolean; txt: string };}>>;
  isProcessing: boolean;
  isProcessing1: boolean;
  setData2: React.Dispatch<
    React.SetStateAction<{
      surovini: { text: string };
      vtoro: { text: string; name: string; id: string };
      treto: { text: string; name: string; id: string };
      kontragent: { text: string };
      supplier: {
        name: string;
        country: string;
        city: string;
        address: string;
        website: string;
        email: string;
        employees: string;
        another: string;
        address_workshop: string;
        kontragent: string;
        phone: string;
        id: string;
      };
      product: {
        treto: { name: string; id: string };
        name: string;
        measure: string;
        density: string;
        size: string;
        weight: string;
        description: string;
        another: string;
        supplier: { name: string; id: string };
        code: string;
        package: string;
        cost: string;
      };
    }>
  >;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  val: number;
  data2: {
    surovini: { text: string };
    vtoro: { text: string; name: string; id: string };
    treto: { text: string; name: string; id: string };
    kontragent: { text: string };
    supplier: {
      name: string;
      country: string;
      city: string;
      address: string;
      website: string;
      email: string;
      employees: string;
      another: string;
      address_workshop: string;
      kontragent: string;
      phone: string;
      id: string;
    };
    product: {
      treto: { name: string; id: string };
      name: string;
      measure: string;
      density: string;
      size: string;
      weight: string;
      description: string;
      another: string;
      supplier: { name: string; id: string };
      code: string;
      package: string;
      cost: string;
    };
  };
  results: {
    surovini: any;
    vtoro: any;
    treto: any;
    kontragent: any;
    supplier: any;
    product: any;
  };
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setProcessing1: React.Dispatch<React.SetStateAction<boolean>>;
  setToasty: React.Dispatch<
    React.SetStateAction<{
      vis: boolean;
      text: string | any;
      status: string;
    }>
  >;
  toasty: { vis: boolean; text: string | any; status: string; };
    setVal: React.Dispatch<React.SetStateAction<number>>;
    setResults: React.Dispatch<
      React.SetStateAction<{
        surovini: any;
        vtoro: any;
        treto: any;
        kontragent: any;
        supplier: any;
        product: any;
      }>
    >;
    chosen: {
      surovini: { name: any; id: any };
      vtoro: any;
      treto: any;
      kontragent: any;
      supplier: any;
      product: any;
    };
    setChosen: React.Dispatch<
      React.SetStateAction<{
        surovini: { name: any; id: any };
        vtoro: any;
        treto: any;
        kontragent: any;
        supplier: any;
        product: any;
      }>
    >;
    idx: number,
    data: any | Object,
    catNames: string,
    catValues: any | Object,

    setEditableIndex: React.Dispatch<React.SetStateAction<number | null>>;
    deleteBtn: boolean;
    setDeleteBtn: React.Dispatch<React.SetStateAction<boolean>>;
    editableIndex: number | null;
    setData: React.Dispatch<React.SetStateAction<any>>;
    setSelect: React.Dispatch<React.SetStateAction<any>>;
    select: any | Object;
    itemId: number,
    props: any,
    isAdd : boolean,
    setAdd: React.Dispatch<React.SetStateAction<boolean>>;
    onPrint: () => void;
    onDeleteAll: () => void;
  }