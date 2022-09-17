// Add Extra Controls
import { ClipboardButton, TextControl, PanelBody, PanelRow } from '@wordpress/components';
import { useState, Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';


const addCustomControls = wp.compose.createHigherOrderComponent((BlockEdit) => {
	return (props) => {

    console.log(props)
		const { attributes, setAttributes, isSelected } = props;
    const [ hasCopied, setHasCopied ] = useState( false );
    const [ customClassInput, setCustomClassInput ] = useState( "" );

    const convertToClassString = (arr) => {
      if(arr.length < 1){
        return ""
      }
      return " " + arr.join(" ") + " "
    }

    const currentClassArray = (str) => {
      if(typeof attributes.className !== 'undefined' && attributes.className.trim() !== ""){
        return attributes.className.trim().split(" ")
      } 
      return []
    }

    const classSet = (classString) => {
      return new Set(classString.trim().split(" "))
    }

    // Regex to validate classes added do not contain illegal characters
    const regexp = /^[a-zA-Z0-9-_]+$/;

    // Listen to keydown and add classes on spacebar or enter key
    const onKeyDown = (e) => {
      if(customClassInput.trim().length){

        // split in case user copies in multiple classes
        let classesToAdd = customClassInput.trim().split(" ").filter(classToAdd => {
          // filter out classes that are already there
          return !currentClassArray().includes(classToAdd)
        })
  
        if ((e.keyCode === 32 || e.keyCode === 13)) {
          e.preventDefault();

          // Merge in new classes
          setAttributes({className: convertToClassString([...currentClassArray(), ...classesToAdd])})

          // empty out input
          setCustomClassInput("")

        }
      }
    };

    const handleDelete = (deletedClass) => {
      let modified = classSet(attributes.className)
      if(modified.has(deletedClass)){
        modified.delete(deletedClass)
      }
      setAttributes({className: convertToClassString([...modified])})
    }


		return (
			<Fragment>
				<BlockEdit {...props} />
				{/* {isSelected && (props.name == 'core/cover') &&  */}
				{isSelected && 
					<InspectorControls>
            <PanelBody title="Custom Classes" initialOpen={true}>
              <PanelRow>
                <TextControl
                  label="Add a class then press space or enter"
                  value={customClassInput}
                  onChange={(value) => {
                    setCustomClassInput(value);
                  }}
                  onKeyDown={onKeyDown}
                />
                
              </PanelRow>
              <PanelRow>
                <div className="better-custom-classes__pill-group">
                  {currentClassArray().map((item, idx) => (
                    // Check agaist regex and add an error class to highlight if classname contains illegal chars
                    <div key={idx} className={`better-custom-classes__pill ${item.search(regexp) === -1 ? 'better-custom-classes__pill--error' : ''}`}>
                      {item}
                      <svg version="1.1" x="0px" y="0px"
                        viewBox="0 0 460.775 460.775"
                        onClick={()=>handleDelete(item)}
                      >
                        <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                          c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                          c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                          c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                          l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                          c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                      </svg>
                    </div>
                  ))}
                </div>
              </PanelRow>
              {currentClassArray().length > 0 && 
                // If custom classes exist show a copy to clipboard button to allow easy copying between blocks
                <PanelRow>
                  <ClipboardButton
                      variant="primary"
                      text={attributes.className}
                      onCopy={ () => setHasCopied( true ) }
                      onFinishCopy={ () => setHasCopied( false ) }
                  >
                      { hasCopied ? 'Copied!' : 'Copy All Classes' }
                  </ClipboardButton>
                </PanelRow>
              }
            </PanelBody>
          </InspectorControls>
				}
			</Fragment>
		);
	};
}, 'addCustomControls');


export default addCustomControls;