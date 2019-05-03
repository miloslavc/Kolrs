import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { db } from "../../firebase";
import ColorCard from "../cards/ColorCard";
import AddColorCard from "../cards/AddColorCard";
function SelectedPalette(props) {
  const [palette, setPalette] = useState(null);
  const [update, setUpdate] = useState(false);
  const [numberOfColors, setNumberOfColors] = useState();

  //get selected project data from firebase and put it to state
  useEffect(() => {
    return db
      .collection("users")
      .doc(`${props.user.uid}`)
      .collection("palettes")
      .doc(`${props.paletteId}`)
      .onSnapshot(
        {
          // Listen for document metadata changes
          includeMetadataChanges: true
        },
        function(doc) {
          setPalette(doc.data());
          setUpdate(true);
          setNumberOfColors(doc.data().colors.length);
        }
      );
  }, [props.paletteId, props.user.uid]);

  return (
    <Wrapper>
      <AddColorCard user={props.user} paletteId={props.paletteId} />
      {update &&
        palette.colors.map(color => (
          <ColorCard
            key={color}
            color={color}
            user={props.user}
            id={props.paletteId}
            colorNumber={numberOfColors}
          >
            {color}
          </ColorCard>
        ))}
    </Wrapper>
  );
}

export default SelectedPalette;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;