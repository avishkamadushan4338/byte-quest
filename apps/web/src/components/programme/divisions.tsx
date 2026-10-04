import { Container } from "@byte-quest/ui/components/container";
import { Section } from "@byte-quest/ui/components/section";
import { SectionHeader } from "@byte-quest/ui/components/section-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TableWrapper,
} from "@byte-quest/ui/components/table";

import { comparisonRows, divisionHeads } from "./data";

export const Divisions = () => (
  <Section id="divisions">
    <Container>
      <SectionHeader
        kicker="DIVISIONS"
        kickerTone="volt"
        lead="Each team competes in one division, based on the grades of its members."
        title="Junior and Senior, side by side."
      />

      <TableWrapper className="mt-12">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell className="min-w-[160px]" />
              {divisionHeads.map((division) => (
                <TableHeadCell className="min-w-[240px]" key={division.label}>
                  <span className="block">{division.label}</span>
                  <span
                    className="font-display mt-1 block text-[26px] tracking-[-0.03em] normal-case"
                    style={{ color: division.color }}
                  >
                    {division.name}
                  </span>
                </TableHeadCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {comparisonRows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="text-faint font-mono text-[10.5px] tracking-[0.14em] whitespace-nowrap uppercase">
                  {row.label}
                </TableCell>
                <TableCell>{row.junior}</TableCell>
                <TableCell>{row.senior}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </Container>
  </Section>
);
