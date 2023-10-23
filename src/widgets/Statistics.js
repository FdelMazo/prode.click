import {
  Box,
  Card,
  CardBody,
  Icon,
  Spinner,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import React from "react";
import {
  MdOutlineBallot,
  MdOutlineCalendarMonth,
  MdPeopleAlt,
} from "react-icons/md";
import useParty from "../logic/useParty";
import useResults from "../logic/useResults";
import { daysUntilElections, getElectionStatus } from "../logic/utils";

const MiniStat = ({ startContent, name, description, value }) => {
  const textColorSecondary = "darkgray.800";

  return (
    <Card direction="row" alignItems="center" p={2} gap={4}>
      {startContent}

      <CardBody p={0}>
        <Stat>
          <StatLabel color={textColorSecondary}>{name}</StatLabel>
          <StatNumber>{value}</StatNumber>
          <StatHelpText
            color={textColorSecondary}
            fontSize="xs"
            fontWeight={500}
          >
            {description}
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );
};

export default function Statistics({ stats }) {
  const { isParty } = useParty();
  const { parties, users } = stats;
  const { isLoadingResults, lastUpdate, tablesPercent } = useResults();

  const days = React.useMemo(daysUntilElections, []);
  const electionStatus = React.useMemo(getElectionStatus, []);

  const iconBoxProps = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    w: 14,
    h: 14,
    bg: "darkgray.300",
    borderColor: "darkgray.700",
    borderWidth: 1,
  };

  const iconProps = {
    w: 8,
    h: 8,
    color: "brand.500",
  };

  // TODO: mostrar resultados de las elecciones anteriores
  return (
    <>
      <MiniStat
        name="Participantes"
        value={users}
        description={
          parties && (
            <Text>
              En <b>{parties}</b> partidas
            </Text>
          )
        }
        startContent={
          <Box {...iconBoxProps}>
            <Icon {...iconProps} as={MdPeopleAlt} />
          </Box>
        }
      />
      {electionStatus === "DAY" || electionStatus === "POST" ? (
        <MiniStat
          name="Mesas escrutadas"
          value={
            isLoadingResults ? (
              <Spinner size="sm" />
            ) : (
              (tablesPercent || 0).toFixed(2) + "%"
            )
          }
          description={
            isLoadingResults ? (
              <br />
            ) : lastUpdate ? (
              <Text>
                Última actualización: <b>{lastUpdate}</b>
              </Text>
            ) : (
              <Text>Se actualizan en vivo, un poquito más de paciencia</Text>
            )
          }
          startContent={
            <Box {...iconBoxProps}>
              <Icon {...iconProps} as={MdOutlineBallot} />
            </Box>
          }
        />
      ) : (
        <MiniStat
          name="Días hasta las elecciones"
          value={days}
          description={
            <>
              {isParty
                ? "Se pueden cambiar las predicciones hasta el día de las elecciones"
                : "Se puede sumar gente hasta el día de las elecciones"}
            </>
          }
          startContent={
            <Box {...iconBoxProps}>
              <Icon {...iconProps} as={MdOutlineCalendarMonth} />
            </Box>
          }
        />
      )}
    </>
  );
}
