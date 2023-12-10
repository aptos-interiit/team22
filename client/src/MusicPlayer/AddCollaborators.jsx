import React from "react";

function AddCollaborators({
  formFields,
  setFormFields,
  remainingSplit,
  setRemainingSplit, 
}) {  
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

  const addFields = (e) => {
    let object = {
      ArtistAddr: "",
      Split: "",
    };
    e.preventDefault();

    setFormFields([...formFields, object]);
  };

  const removeFields = (index) => {
    let data = [...formFields];
    if (data[index].Split !== "") {
      setRemainingSplit(parseInt(remainingSplit) + parseInt(data[index].Split));
    }
    data.splice(index, 1);
    setFormFields(data);
  };

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
      console.log(formFields);
    } else {
      alert("Split should be 100%");
    }
  };

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
