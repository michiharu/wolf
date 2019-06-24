import React from 'react';
import { Typography, Button, Box } from '@material-ui/core';
import { Manual } from '../../../../data-types/tree';
import { CopyActions } from './copy-container';
import Util from '../../../../func/util';
import TitleChecker from '../../../../components/title-checker/title-checker';
import { TitleCheckState } from '../../../../redux/states/titleCheckState';


interface Props extends TitleCheckState, CopyActions {
  manual: Manual;
}

const Copy: React.FC<Props> = props => {

  const { manual, copy, title, result } = props;

  function handleClick() {
    copy({...manual, id: Util.getID(), title});
  }

  return (
    <div>
      <Box py={2}><Typography variant="h5">マニュアルを複製する</Typography></Box>
      <Box display="flex" flexDirection="row" alignItems="flex-end" py={2}>
        <Box flexGrow={1}>
          <TitleChecker defaultTitle="" willGenerate={manual.title}/>
        </Box>
        <Box ml={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            disabled={title === "" || result === null || title !== result.title || !result.valid}
          >
            複製する
          </Button>
        </Box>
      </Box>
    </div>
  );
}
export default Copy;