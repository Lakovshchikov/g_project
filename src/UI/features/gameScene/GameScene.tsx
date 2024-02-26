import React, { useState, type FC } from "react";
import { cn } from "@bem-react/classname";
import { Card, Switch, Typography } from "antd";
import "./styles.css";
import engine from "@/Engine";
import { Box } from "@/Engine/Components/Box";
import { CreateObjectControls } from "@/Engine/Controls/CreateObjectControls";
import { MapNavigationControls } from "@/Engine/Controls/MapNavigationControls";
import { SelectionControls } from "@/Engine/Controls/SelectionControls";
import { SceneObjectFactory } from "@/Engine/Core/SceneObjectFactory";
import { ENEMIES_GROUPS } from "@/Engine/constants";

const { Paragraph } = Typography;

const cl = cn("game-scene");

const boxCreationFactory = new SceneObjectFactory<Box, { groups: string[] }>(Box, {
  groups: [ENEMIES_GROUPS.SELECTABLE],
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectionMouseControls = new SelectionControls(engine);
const mapNavigationControls = new MapNavigationControls(engine);
mapNavigationControls.enable();
selectionMouseControls.enable();
const createBoxControls = new CreateObjectControls(engine, boxCreationFactory);

export const GameScene: FC = () => {
  const [isCreateObjectEnabled, setIsCreateObjectEnabled] = useState(false);
  const [isSelectionEnabled, setIsSelectionEnabled] = useState(true);

  const onChangeCreateObjectEnabled = () => {
    setIsCreateObjectEnabled((v) => !v);
    isCreateObjectEnabled ? createBoxControls.disable() : createBoxControls.enable();
    if (isSelectionEnabled) {
      selectionMouseControls.disable();
      setIsSelectionEnabled(false);
    }
  };

  const onChangeMovementEnabled = () => {
    setIsSelectionEnabled((v) => !v);
    isSelectionEnabled ? selectionMouseControls.disable() : selectionMouseControls.enable();
    if (isCreateObjectEnabled) {
      createBoxControls.disable();
      setIsCreateObjectEnabled(false);
    }
  };

  return (
    <div className={cl()}>
      <Card title="Конфигурация" bordered={false} style={{ width: 300 }}>
        <div className={cl("row")}>
          <Paragraph>Создание объектов</Paragraph>
          <Switch value={isCreateObjectEnabled} onChange={onChangeCreateObjectEnabled} />
        </div>

        <div className={cl("row")}>
          <Paragraph>Выбор объектов</Paragraph>
          <Switch value={isSelectionEnabled} onChange={onChangeMovementEnabled} />
        </div>
      </Card>
    </div>
  );
};
