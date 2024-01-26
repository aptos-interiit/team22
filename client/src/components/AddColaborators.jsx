// Summary: This component is used to add collaborators to the song. It takes 
// in the formFields, setFormFields, remainingSplit and setRemainingSplit as 
// props. It returns the AddCollaborators component.


// importing libraries and dependencies
import React from "react";
import { MdGroupRemove } from "react-icons/md";

// AddCollaborators component
function AddCollaborators({
  formFields,
  setFormFields,
  remainingSplit,
  setRemainingSplit,
}) {

  // function to handle form change
  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    if (event.target.name === "Split") {
      let sum = 0;
      let id = 0;
      formFields.map((form, index) => {
        if (id !== 0) {
          sum += parseInt(form.Split);
        }
        id += 1;
      });
      setRemainingSplit(100 - sum);
    }
    setFormFields(data);
  };

  // function to add fields
  const addFields = (e) => {
    let object = {
      ArtistAddr: "",
      Split: "",
    };
    e.preventDefault();

    setFormFields([...formFields, object]);
  };

  // function to remove fields
  const removeFields = (index) => {
    let data = [...formFields];
    if (data[index].Split !== "") {
      setRemainingSplit(parseInt(remainingSplit) + parseInt(data[index].Split));
    }
    data.splice(index, 1);
    setFormFields(data);
  };


  // returning the AddCollaborators component
  return (
    <div>
      {formFields.map((form, index) => {
        return (
          <div key={index} className="grid grid-cols-2 p-5">
            {index === 0 ? (
              <div className="grid grid-cols-2">

                <div>
                  <label className="text-white dark:text-gray-200" >Owner Address</label><br />
                  <input
                    disabled={true}
                    name="ArtistAddr"
                    placeholder="Main admin address"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.ArtistAddr}
                    className="col-span-1 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>


                <div className="ml-5">
                  <label className="text-white dark:text-gray-200" >Owner Split</label><br />
                  <input
                    name="Split"
                    placeholder="Split"
                    onChange={(event) => handleFormChange(event, index)}
                    value={remainingSplit}
                    className="col-span-1 px-4 py-2 mt-2  text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    min={0}
                    max={100}
                    type="number"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2">

                <div>
                  <label className="text-white dark:text-gray-200" >Colaborator Address</label><br />
                  <input
                    name="ArtistAddr"
                    placeholder="Artist wallet address"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.ArtistAddr}
                    className="col-span-1 px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  />
                </div>
                <div className="ml-5">

                  <label className="text-white dark:text-gray-200" >Colaborator Split</label><br />
                  <input
                    name="Split"
                    placeholder="Split"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.Split}
                    className="col-span-1 px-4 py-2 mt-2 mx-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                    min={0}
                    max={100}
                    type="number"
                  />
                </div>
              </div>
            )}

            {index !== 0 ? (
              <button
                className="text-white dark:text-gray-200 flex justify-center pt-8"
                onClick={(e) => {
                  e.preventDefault();
                  removeFields(index);
                }}
              >
                <MdGroupRemove size={24} />
              </button>
            ) : (
              <div className="flex justify-center text-white dark:text-gray-200"></div>
            )}
          </div>
        );
      })}
      <button className="text-white dark:text-gray-200 p-2 bg-gray-500 rounded-md" onClick={(e) => addFields(e)}>Add More</button>
    </div>
  );
}

export default AddCollaborators;
