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
import { canBid, daysUntilElections } from "../logic";

const MiniStat = ({
  startContent,
  bottomContent,
  topContent,
  name,
  description,
  value,
}) => {
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
  const { parties, users } = stats;
  // TODO: use the results!
  // const { isLoadingResults, lastUpdate, tablesPercent } = useResults();
  const { isLoadingResults, lastUpdate, tablesPercent } = {};

  const days = React.useMemo(daysUntilElections, []);
  const bid = React.useMemo(canBid, []);
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
      {days <= 0 ? (
        <MiniStat
          name="Mesas escrutinadas"
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
                Última actualización:{" "}
                <b>{lastUpdate.toLocaleTimeString("en-US")}</b>
              </Text>
            ) : (
              <Text>Un poquito más de paciencia</Text>
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
            <Text color={!bid && "red.400"}>
              {bid ? (
                <>
                  Se pueden cambiar las predicciones hasta el <b>viernes</b>{" "}
                  pre-elecciones
                </>
              ) : (
                "Ya no se pueden cambiar las predicciones"
              )}
            </Text>
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
