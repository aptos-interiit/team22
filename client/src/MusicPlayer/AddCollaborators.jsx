// Summary: This file contains the code for the AddCollaborators component. 


// importing dependencies
import React from "react";

// AddCollaborators component
function AddCollaborators({
  formFields,
  setFormFields,
  remainingSplit,
  setRemainingSplit, 
}) {  

  // function to handle form change
  const handleFormChange = (event, index) => {

    // data: state to store the form fields
    let data = [...formFields];

    // updating the data state
    data[index][event.target.name] = event.target.value;

    // if the name of the event target is Split
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

  // function to check and submit
  const check_and_submit = (e) => {
    e.preventDefault();
    let sum = 0;
    let id = 0;
    formFields.forEach((element) => {
      if (id !== 0) {
        sum += parseInt(element.Split);
      }
      id += 1;
    });
    if (sum < 100) {
      let x = [...formFields];
      x[0].Split = 100 - sum;
      setFormFields(x);
      setRemainingSplit(100 - sum);
    } else {
      alert("Split should be 100%");
    }
  };

  // returning the AddCollaborators component
  return (
    <div>
      {formFields.map((form, index) => {
        return (
          <div key={index} className="grid grid-cols-2 p-5">
            {index === 0 ? (
              <div className="grid grid-cols-2">
                <input
                  name="ArtistAddr"
                  placeholder="Main admin address"
                  onChange={(event) => handleFormChange(event, index)}
                  value={form.ArtistAddr}
                  className="col-span-1 p-2"
                />
                <input
                  name="Split"
                  placeholder="Split"
                  onChange={(event) => handleFormChange(event, index)}
                  value={remainingSplit}
                  className="col-span-1 p-2"
                  min={0}
                  max={100}
                  type="number"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2">
                <input
                  name="ArtistAddr"
                  placeholder="Artist wallet address"
                  onChange={(event) => handleFormChange(event, index)}
                  value={form.ArtistAddr}
                  className="col-span-1 p-2"
                />
                <input
                  name="Split"
                  placeholder="Split"
                  onChange={(event) => handleFormChange(event, index)}
                  value={form.Split}
                  className="col-span-1 p-2"
                  min={0}
                  max={100}
                  type="number"
                />
              </div>
            )}

            {index !== 0 ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFields(index);
                }}
              >
                Remove
              </button>
            ) : (
              <div className="flex justify-center">Main Artist</div>
            )}
          </div>
        );
      })}
      <button onClick={(e) => addFields(e)}>Add More..</button>
      <button
        onClick={(e) => {
          e.preventDefault();
          check_and_submit(e);
        }}
      >
        add colabs
      </button>
    </div>
  );
}

export default AddCollaborators;
