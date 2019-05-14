import { Tree } from "../../../data-types/tree-node";

export const manual1 = {
  "id": "1",
  "type": "task",
  "label": "ケアマネ送付関連月初作業手順",
  "input": "",
  "output": "",
  "children": [
    {
      "id": "2",
      "type": "task",
      "label": "実績作成",
      "input": "",
      "output": "",
      "children": [
        {
          "id": "3",
          "type": "task",
          "label": "キャロッツメインメニューのヘルパーをクリック",
          "input": "",
          "output": "",
          "children": []
        },
        {
          "id": "4",
          "type": "task",
          "label": "提供済みのサービス実施記録書を用意する",
          "input": "",
          "output": "",
          "children": []
        },
        {
          "id": "5",
          "type": "task",
          "label": "チェック用ファイルを印刷する",
          "input": "回収スケジュール.xlsx",
          "output": "回収スケジュール（紙）",
          "children": []
        },
        {
          "id": "6",
          "type": "task",
          "label": "利用者変更をクリック",
          "input": "",
          "output": "",
          "children": []
        },
        {
          "id": "7",
          "type": "task",
          "label": "利用者を選択する",
          "input": "",
          "output": "",
          "children": []
        },
        {
          "id": "8",
          "type": "switch",
          "label": "記録書の到着を確認する",
          "input": "",
          "output": "",
          "children": [
            {
              "id": "9",
              "type": "case",
              "label": "到着している",
              "input": "",
              "output": "",
              "children": [
                {
                  "id": "10",
                  "type": "switch",
                  "label": "記録書の時間変更の有無",
                  "input": "",
                  "output": "",
                  "children": [
                    {
                      "id": "11",
                      "type": "case",
                      "label": "時間変更がある",
                      "input": "",
                      "output": "",
                      "children": [
                        {
                          "id": "12",
                          "type": "switch",
                          "label": "責任者（山口）に連絡する",
                          "input": "",
                          "output": "",
                          "children": [
                            {
                              "id": "13",
                              "type": "case",
                              "label": "連絡がつく",
                              "input": "",
                              "output": "",
                              "children": [
                                {
                                  "id": "14",
                                  "type": "task",
                                  "label": "時間変更の内容からサービスコードを確認する",
                                  "input": "",
                                  "output": "",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "id": "15",
                              "type": "case",
                              "label": "連絡がつかない",
                              "input": "",
                              "output": "",
                              "children": [
                                {
                                  "id": "16",
                                  "type": "task",
                                  "label": "利用者の担当ケアマネに相談する",
                                  "input": "",
                                  "output": "",
                                  "children": []
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "id": "17",
                      "type": "case",
                      "label": "時間変更がない",
                      "input": "",
                      "output": "",
                      "children": [
                        {
                          "id": "18",
                          "type": "task",
                          "label": "利用者変更をクリック",
                          "input": "",
                          "output": "",
                          "children": []
                        },
                        {
                          "id": "19",
                          "type": "task",
                          "label": "利用者を選択する",
                          "input": "",
                          "output": "",
                          "children": []
                        },
                        {
                          "id": "20",
                          "type": "task",
                          "label": "実績を入力する",
                          "input": "",
                          "output": "",
                          "children": []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "id": "21",
              "type": "case",
              "label": "到着していない",
              "input": "",
              "output": "",
              "children": [
                {
                  "id": "22",
                  "type": "task",
                  "label": "新しい作業",
                  "input": "",
                  "output": "",
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "23",
      "type": "task",
      "label": "利用者状況報告書",
      "input": "",
      "output": "",
      "children": []
    },
    {
      "id": "24",
      "type": "task",
      "label": "ケアマネ送付文",
      "input": "",
      "output": "",
      "children": []
    }
  ]
} as Tree;