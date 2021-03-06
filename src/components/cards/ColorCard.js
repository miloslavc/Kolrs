import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import tinycolor from 'tinycolor2';
import { Redirect } from '@reach/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { UserContext } from '../../context/UserContext';

// components
import DeleteButton from '../buttons/DeleteButton';

// api
import { db, firebase } from '../../firebase';

// assets
import { Card, CardH1, CardH2, CardH3 } from '../../elements';
import { blackText, white } from '../../utils';

function ColorCard({ color, id, colorNumber }) {
  const { user } = useContext(UserContext);

  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [copied, setCopied] = useState(false);

  // delete color or palette
  const handleDelete = () => {
    const data = db
      .collection('users')
      .doc(`${user.uid}`)
      .collection('palettes')
      .doc(`${id}`);
    if (colorNumber > 1) {
      data.update({
        colors: firebase.firestore.FieldValue.arrayRemove(`${color}`),
      });
    } else {
      data.delete();
      setShouldRedirect(true);
    }
  };

  useEffect(() => {
    if (copied === true) {
      setTimeout(() => setCopied(false), 1800);
    }
  }, [copied, colorNumber]);

  // color converter
  const rgb = tinycolor(color).toRgbString();
  const hsl = tinycolor(color).toHslString();
  const hex = color;
  const colorTransform = tinycolor(color);

  return shouldRedirect ? (
    <Redirect to="/" />
  ) : (
    <Card color={color} textColor={colorTransform.isDark() ? white : blackText}>
      <CopyToClipboard text={hex} onCopy={() => setCopied(true)}>
        <CardH1>{hex.toUpperCase()}</CardH1>
      </CopyToClipboard>
      <br />
      <CopyToClipboard text={rgb} onCopy={() => setCopied(true)}>
        <CardH2>{rgb.toUpperCase()}</CardH2>
      </CopyToClipboard>
      <br />
      <CopyToClipboard text={hsl} onCopy={() => setCopied(true)}>
        <CardH3>{hsl.toUpperCase()}</CardH3>
      </CopyToClipboard>
      {copied && (
        <Copy
          background={colorTransform.isDark() ? white : blackText}
          color={color}
        >
          Copied
        </Copy>
      )}
      <Icons>
        <DeleteButton
          textColor={colorTransform.isDark() ? white : blackText}
          handleDelete={handleDelete}
        />
      </Icons>
    </Card>
  );
}

export default ColorCard;

const Copy = styled.h1`
  cursor: pointer;
  font-size: 1.5em;
  display: inline-block;
  background: ${props => props.background};
  border-radius: 3px;
  color: ${props => props.color};
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  font-weight: 500;
`;

const Icons = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  padding: 1em 0;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
`;
