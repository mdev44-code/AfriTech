import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import path from "node:path";
import fs from "node:fs";

import type { Quote, QuoteLine, QuoteRequest } from "@prisma/client";

// Avoids a network fetch to react-pdf's default hyphenation dictionary.
Font.registerHyphenationCallback((word) => [word]);

const BRAND_BLUE = "#153A63";
const BRAND_BLUE_LIGHT = "#2C6CB8";
const TEXT_DARK = "#1A1A1E";
const TEXT_MUTED = "#5C6068";
const BORDER = "#E4E4E7";

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    color: TEXT_DARK,
    paddingBottom: 64,
  },
  header: {
    backgroundColor: BRAND_BLUE,
    paddingHorizontal: 40,
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 700,
  },
  headerRef: {
    color: "#FFFFFF",
    fontSize: 10,
    textAlign: "right",
  },
  body: {
    padding: 40,
  },
  sectionTitle: {
    fontSize: 9,
    color: BRAND_BLUE_LIGHT,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoBlock: {
    width: "48%",
  },
  infoText: {
    fontSize: 10,
    color: TEXT_DARK,
    marginBottom: 2,
  },
  infoMuted: {
    fontSize: 9,
    color: TEXT_MUTED,
    marginBottom: 2,
  },
  table: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F4F6F8",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  colLabel: { width: "52%" },
  colQty: { width: "14%", textAlign: "center" },
  colPrice: { width: "17%", textAlign: "right" },
  colTotal: { width: "17%", textAlign: "right" },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 700,
    color: TEXT_MUTED,
    textTransform: "uppercase",
  },
  tableCellText: {
    fontSize: 10,
    color: TEXT_DARK,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  totalBox: {
    backgroundColor: BRAND_BLUE,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  totalLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: 700,
  },
  totalValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 700,
  },
  conditionsBlock: {
    marginTop: 28,
  },
  conditionsText: {
    fontSize: 9,
    color: TEXT_MUTED,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footerText: {
    fontSize: 8,
    color: TEXT_MUTED,
    textAlign: "center",
  },
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

function getLogoSource(): string | undefined {
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  if (fs.existsSync(logoPath)) {
    return logoPath;
  }
  return undefined;
}

interface QuoteDocumentProps {
  quote: Quote & { lines: QuoteLine[] };
  quoteRequest: QuoteRequest;
}

function QuoteDocument({ quote, quoteRequest }: QuoteDocumentProps) {
  const reference = `DEVIS-${quote.id.slice(-8).toUpperCase()}`;
  const logoSrc = getLogoSource();

  return (
    <Document title={reference}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerBrand}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, not an HTML img */}
            {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : null}
            <Text style={styles.headerTitle}>Afritech</Text>
          </View>
          <View>
            <Text style={styles.headerRef}>{reference}</Text>
            <Text style={styles.headerRef}>{formatDate(new Date())}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.sectionTitle}>Client</Text>
              <Text style={styles.infoText}>{quoteRequest.name}</Text>
              <Text style={styles.infoMuted}>{quoteRequest.email}</Text>
              {quoteRequest.phone ? (
                <Text style={styles.infoMuted}>{quoteRequest.phone}</Text>
              ) : null}
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.sectionTitle}>Projet</Text>
              <Text style={styles.infoText}>{quoteRequest.projectType}</Text>
              {quoteRequest.budget ? (
                <Text style={styles.infoMuted}>
                  Budget indicatif : {quoteRequest.budget}
                </Text>
              ) : null}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Prestations</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderText, styles.colLabel]}>
                Prestation
              </Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>Qté</Text>
              <Text style={[styles.tableHeaderText, styles.colPrice]}>
                Prix unitaire
              </Text>
              <Text style={[styles.tableHeaderText, styles.colTotal]}>
                Total
              </Text>
            </View>
            {quote.lines.map((line, index) => (
              <View
                key={line.id}
                style={[
                  styles.tableRow,
                  index === quote.lines.length - 1 ? styles.tableRowLast : {},
                ]}
              >
                <Text style={[styles.tableCellText, styles.colLabel]}>
                  {line.label}
                </Text>
                <Text style={[styles.tableCellText, styles.colQty]}>
                  {line.quantity}
                </Text>
                <Text style={[styles.tableCellText, styles.colPrice]}>
                  {formatCurrency(Number(line.price))}
                </Text>
                <Text style={[styles.tableCellText, styles.colTotal]}>
                  {formatCurrency(Number(line.price) * line.quantity)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalRow}>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(Number(quote.total))}
              </Text>
            </View>
          </View>

          {quote.conditions ? (
            <View style={styles.conditionsBlock}>
              <Text style={styles.sectionTitle}>Conditions</Text>
              <Text style={styles.conditionsText}>{quote.conditions}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Afritech — Agence de création logicielle web, mobile & IA.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generateQuotePdf(
  quote: Quote & { lines: QuoteLine[] },
  quoteRequest: QuoteRequest,
): Promise<Buffer> {
  return renderToBuffer(
    <QuoteDocument quote={quote} quoteRequest={quoteRequest} />,
  );
}
