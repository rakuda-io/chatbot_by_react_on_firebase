import React, { useState, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextInput } from './index';
import { WEBHOOK_URL } from '../../webhookConfig';

const FormDialog = (props) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")

  const inputName = useCallback((e) => {
    setName(e.target.value)
  },[setName])

  const inputEmail = useCallback((e) => {
    setEmail(e.target.value)
  },[setEmail])

    const inputDescription = useCallback((e) => {
      setDescription(e.target.value)
    },[setDescription])

  //メールアドレスの書式をチェックするバリデーション
  const validateEmailFormat = (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return regex.test(email)
  }

  //入力欄の空欄をチェックするバリデーション
  const validateRequiredInput = (...args) => {
    let isBlank = false;
    for (let i = 0; i < args.length; i=(i+1)|0) {
        if (args[i] === "") {
            isBlank = true;
        }
    }
    return isBlank
  };

  const submitForm = () => {
    const isBlank = validateRequiredInput(name, email, description)
    const isValidEmail = validateEmailFormat(email)

    if (isBlank) {
      alert('必須入力欄が空白です。')
      return false
    } else if (!isValidEmail) {
      alert('メールアドレスの書式が異なります。')
      return false
    } else {
    const payload = {
      text: 'お問い合わせがありました\n' +
            'お名前：' + name + '\n' +
            'メールアドレス：' + email + '\n' +
            '【問い合わせ内容】：\n' + description
      }
      // Slackへ通知を送る
      fetch(WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      }).then(() => {
        alert('送信が完了しました。追ってご連絡差し上げます。')
        setName("")
        setEmail("")
        setDescription("")
        return props.handleClose();
      })
    }
  }

  return(
    <Dialog
    open={props.open}
    onClose={props.handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      お問い合わせフォーム
    </DialogTitle>
    <DialogContent>
      <TextInput
        label={"名前(必須)"} multiline={false} rows={1}
        value={name} type={"text"} onChange={inputName}
      />
      <TextInput
        label={"メールアドレス(必須)"} multiline={false} rows={1}
        value={email} type={"email"} onChange={inputEmail}
      />
      <TextInput
        label={"お問い合わせ内容(必須)"} multiline={true} rows={5}
        value={description} type={"text"} onChange={inputDescription}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={props.handleClose}>
        キャンセル
      </Button>
      <Button onClick={submitForm} autoFocus>
        送信する
      </Button>
    </DialogActions>
  </Dialog>
  )
}

export default FormDialog;